import React, { useCallback, useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../../components/Tabs/Tabs";
import BoardView from "../../components/Ticket/BoardView";
import Table from "../../components/Ticket/Table";
import PaginationBar from "../../components/Ticket/PaginadoTickets";
import { listTickets, listFilteredTickets } from "../../services/TicketService";
import { Transition } from "@headlessui/react";
import TaskTitle from "../../components/Ticket/TaskTitle";
import Title from "../../components/Ticket/Title";
import { toast } from "sonner";

const TABS = [
  { title: "Cuadricula", icon: <MdGridView /> },
  { title: "Lista View", icon: <FaList /> },
];

// Ensure keys match the actual status values used in URLs/API (lowercase, hyphenated?)
// Adjust these keys if your actual status values are different (e.g., "en proceso", "completados")
const TASK_TYPE = {
  pendiente: "bg-blue-600",
  "en-proceso": "bg-yellow-600", // Assuming URL/API uses 'en-proceso'
  completado: "bg-green-600",  // Assuming URL/API uses 'completado'
};

const Tasks = () => {
  const params = useParams();
  const isAuth = localStorage.getItem("authToken");
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [errorConexion, setErrorConexion] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  // const [permisos, setPermisos] = useState([]); // Removed if not used
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('selectedTab');
    return saved !== null ? Number(saved) : 0;
  });
  // Normalize status from URL params (e.g., convert spaces or different cases if needed)
  const status = params?.estado || ""; // Consider .toLowerCase() if case varies

  const handleTabChange = useCallback((index) => {
    setSelected(index);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTab', selected);
  }, [selected]);

  // Wrap toast calls in setTimeout to avoid flushSync warning
  const showInfoToast = (message) => setTimeout(() => toast.info(message), 0);
  const showErrorToast = (message) => setTimeout(() => toast.error(message), 0);

  const fetchTickets = useCallback(async (page, filterStatus = "") => {
    setLoading(true);
    setErrorConexion(false); // Reset error state before fetching
    try {
      let response;
      if (filterStatus) {
        // Use the delayed toast function
        showInfoToast(`Fetching filtered tickets with status: ${filterStatus}`);
        response = await listFilteredTickets(page, filterStatus);
      } else {
        // Use the delayed toast function
        showInfoToast("Fetching all tickets...");
        response = await listTickets(page);
      }
      setTickets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setErrorConexion(true);
      // Use the delayed toast function
      showErrorToast("Error fetching tickets.");
      console.error("Error fetching tickets:", error);
      // Optionally clear tickets/pages on error
      // setTickets([]);
      // setTotalPages(0);
    } finally {
      setLoading(false);
    }
    // Dependencies for useCallback: include functions/variables from outer scope that it uses.
    // State setters (like setLoading) are stable and don't need to be listed.
    // Imported functions (listTickets, listFilteredTickets) are generally stable if they are top-level imports.
  }, []); // No external dependencies needed inside useCallback if listTickets/listFilteredTickets are stable imports

  useEffect(() => {
    if (isAuth) {
      // Reset page to 0 when status changes? Optional, but often desired for filters.
      // Consider if you want this behavior:
      // setPagina(0); // Uncomment if changing filter should reset pagination

      fetchTickets(pagina, status);
    }
    // Ensure fetchTickets is stable (due to useCallback)
  }, [isAuth, pagina, status, fetchTickets]);

  // Reset pagination when status filter changes
  useEffect(() => {
    setPagina(0);
  }, [status]);


  function nextPage() {
    // Prevent going beyond the last page
    if (pagina < totalPages - 1) {
      setPagina(pagina + 1);
    }
  }

  function prevPage() {
    // Prevent going below the first page
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  }

  // Helper to get the correct class name based on status
  // Make sure the keys here EXACTLY match the status values you expect
  const getTaskTypeClass = (statusKey) => {
    return TASK_TYPE[statusKey.toLowerCase()] || 'bg-gray-400'; // Default color
  }

  return loading ? (
    <div className="py-10">
      {/* Consider using a more accessible loading indicator */}
      <div className="dots-container" role="status" aria-live="polite">
        Loading...
        {/* <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div> */}
      </div>
    </div>
  ) : (
    <Transition
      as="div"
      appear
      show={!loading} // Ensure transition shows when not loading
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150" // Optional: add leave transition
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="w-full" // Moved className here from Transition content
    >
      {/* Removed duplicate w-full div */}
      <div className="flex items-center justify-between mb-4">
        {/* Removed redundant inner div */}
        <Title title={status ? `Tickets ${status.replace('-', ' ')}` : "Tickets"} />

        {/* Conditionally render Button based on permissions or context if needed */}
        {!status && ( // Only show "Create Ticket" if no filter is applied
          <Button
            label='Crear ticket'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded py-2 2xl:py-2.5'
            // onClick={() => { /* Add navigation or modal logic */ }}
          />
        )}
      </div>

      <Tabs
        tabs={TABS}
        selected={selected}
        setSelected={handleTabChange}
      >
        {/* Task Titles only shown when viewing all tickets (Board View likely) */}
        {!status && selected !== 1 && ( // Show titles only if no status filter AND in Board view (selected === 0)
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-12 py-4'>
            {/* Make sure the keys match your TASK_TYPE object */}
            <TaskTitle label='Pendiente' className={getTaskTypeClass('pendiente')} />
            <TaskTitle label='En Proceso' className={getTaskTypeClass('en-proceso')} />
            <TaskTitle label='Completado' className={getTaskTypeClass('completado')} />
          </div>
        )}

        {/* Conditional Rendering of Views */}
        {selected !== 1 ? (
          <BoardView tickets={tickets} />
        ) : (
          <div className="w-full overflow-x-auto"> {/* Added overflow for smaller screens */}
            <Table tickets={tickets} />
          </div>
        )}
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationBar
          currentPage={pagina} // Pass zero-based index
          totalPages={totalPages}
          onPrev={prevPage}
          onNext={nextPage}
          // Disable buttons appropriately
          isPrevDisabled={pagina === 0}
          isNextDisabled={pagina >= totalPages - 1}
        />
      )}

      {/* Handle Error State */}
      {errorConexion && (
          <div className="text-red-600 text-center mt-4">
              Failed to load tickets. Please check your connection and try again.
          </div>
      )}
       {/* Handle No Tickets State */}
       {!loading && !errorConexion && tickets.length === 0 && (
          <div className="text-gray-500 text-center mt-4">
              No tickets found{status ? ` with status "${status.replace('-', ' ')}"` : ''}.
          </div>
      )}
    </Transition>
  );
};
export default Tasks;
