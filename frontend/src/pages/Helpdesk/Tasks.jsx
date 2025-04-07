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
import { listTickets } from "../../services/TicketService";
import { Transition } from "@headlessui/react";

const TABS = [
  { title: "Cuadricula", icon: <MdGridView /> },
  { title: "Lista View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "en proceso": "bg-yellow-600",
  completado: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const isAuth = localStorage.getItem("authToken");
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [errorConexion, setErrorConexion] = useState(false); // Estado para indicar si hubo un error de conexión
  const [totalPages, setTotalPages] = useState(0);
  const [permisos, setPermisos] = useState([]);
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('selectedTab');
    return saved !== null ? Number(saved) : 0;
  });
  const status = params?.status || "";


 // Usar useCallback para evitar recreación en cada render
 const handleTabChange = useCallback((index) => {
  setSelected(index);
}, []);

// useEffect(() => {
  // localStorage.setItem('selectedTab', selected);
// }, [selected]);

useEffect(() => {
  localStorage.setItem('selectedTab', selected);
    const fetchTickets = async () => {
      // await getAllTickets();
        setLoading(true); // Mostrar el spinner de carga
        try {
          const response = await listTickets(pagina); // Llama al servicio para obtener los usuarios
          setTickets(response.data.content); // Actualiza el estado con la lista de usuarios
          setTotalPages(response.data.totalPages); // Actualiza el estado con la lista de usuarios)
        } catch (error) {
          setErrorConexion(error != null); // Indica que hubo un error de conexión
        } finally {
          setLoading(false); // Oculta el spinner de carga
        }
    };
    if (isAuth) fetchTickets();
  }, [isAuth, pagina, selected]);

  function nextPage() {
    setPagina(pagina + 1);
  }

  function prevPage() {
    setPagina(pagina - 1);
  }

  // async function getAllTickets() {
  //   setLoading(true); // Mostrar el spinner de carga
  //   try {
  //     const response = await listTickets(pagina); // Llama al servicio para obtener los usuarios
  //     setTickets(response.data.content); // Actualiza el estado con la lista de usuarios
  //     setTotalPages(response.data.totalPages); // Actualiza el estado con la lista de usuarios)
  //   } catch (error) {
  //     setErrorConexion(error != null); // Indica que hubo un error de conexión
  //   } finally {
  //     setLoading(false); // Oculta el spinner de carga
  //   }
  // }

  return loading ? (
    <div className="py-10">
      <div className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  ) : (
    <Transition
      as="div"
      appear
      show
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className=""
    >
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
        <div className='flex items-center justify-between mb-4'>
        {/* <Title title={status ? `${status} Tasks` : "Tasks"} /> */}

        {!status && (
          <Button
            label='Crear ticket'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded py-2 2xl:py-2.5'
          />
        )}
      </div>
        </div>
        <Tabs 
          tabs={TABS} 
          selected={selected} 
          setSelected={handleTabChange}
        >
          {/* {!status && (
          <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
            <TaskTitle label='Pendiente' className={TASK_TYPE.todo} />
            <TaskTitle
              label='En proceso'
              className={TASK_TYPE["en proceso"]}
            />
            <TaskTitle label='Completado' className={TASK_TYPE.completado} />
          </div>
        )} */}
          {selected !== 1 ? (
            <BoardView tickets={tickets} />
          ) : (
            <div className="w-full">
              <Table tickets={tickets} />
            </div>
          )}
        </Tabs>
        {/* <AddTask open={open} setOpen={setOpen} /> */}
        {totalPages > 1 && (
          <PaginationBar
            currentPage={pagina}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
          />
        )}
      </div>
    </Transition>
  );
};
export default Tasks;
