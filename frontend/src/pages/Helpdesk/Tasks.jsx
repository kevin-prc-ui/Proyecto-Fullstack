import React, { useCallback, useEffect, useState } from "react";
import { FaList, FaUser } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Transition } from "@headlessui/react";

// Componentes locales
import Tabs from "../../components/Tabs/Tabs";
import BoardView from "../../components/Ticket/BoardView";
import Table from "../../components/Ticket/Table";
import PaginationBar from "../../components/Ticket/PaginadoTickets";
import Title from "../../components/Ticket/Title";
import CreateTicket from "../../components/Ticket/CreateTicket";

// Servicios y utilidades
import { 
  listTickets, 
  listFilteredTickets, 
  listTicketsByUser 
} from "../../services/TicketService";
import { listAllDepartamentos } from "../../services/DepartamentoService";
import { getUserId } from "../../services/UsuarioService";

/**
 * @constant TABS
 * @description Configuración para las pestañas de visualización (Cuadrícula y Lista).
 * @type {Array<object>}
 */
const TABS = [
  { title: "Cuadrícula", icon: <MdGridView /> },
  { title: "Lista", icon: <FaList /> },
];

/**
 * @function useQuery
 * @description Hook personalizado para obtener los parámetros de consulta de la URL.
 * @returns {URLSearchParams} Objeto con los parámetros de búsqueda.
 */
const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

/**
 * @component Tasks
 * @description Componente principal para mostrar y gestionar la lista de tickets.
 * Permite visualizar tickets en formato de cuadrícula o tabla, filtrar por estado/departamento/usuario,
 * paginar resultados y manejar estados de carga/error.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} [props.userTicketsOnly=false] - Si es true, muestra solo los tickets del usuario actual
 * @returns {JSX.Element} El componente renderizado.
 */
const Tasks = ({ userTicketsOnly = false }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const params = useParams();
  const query = useQuery();
  // const { currentUser } = useAuth(); // Obtener usuario actual del contexto de autenticación

  // Estados del componente
  const [pagina, setPagina] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [errorConexion, setErrorConexion] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedTab");
    const initialSelected = saved !== null ? Number(saved) : 0;
    return [0, 1, 2].includes(initialSelected) ? initialSelected : 0;
  });

  /**
   * @description Estado del ticket extraído de los parámetros de la URL o query params
   * Prioridad: params.estado > query.get('estado') > ''
   */
  const status = params?.estado || query.get('estado') || '';

  /**
   * @function fetchDepartamentos
   * @description Obtiene la lista de departamentos desde la API
   */
  const fetchDepartamentos = useCallback(async () => {
    try {
      const response = await listAllDepartamentos();
      setDepartamentos(response.data || []);
    } catch (error) {
      showErrorToast("Error al cargar los departamentos.");
      console.error("Error fetching departamentos:", error);
      setDepartamentos([]);
    }
  }, []);

  /**
   * @function showErrorToast
   * @description Muestra un mensaje de error usando toast
   */
  const showErrorToast = (message) => setTimeout(() => toast.error(message), 0);

  /**
   * @function fetchTickets
   * @description Obtiene tickets según los filtros aplicados
   */
  const fetchTickets = useCallback(async (page, filterStatus = "", filterDepartamento = "") => {
    setLoading(true);
    setErrorConexion(false);
    
    try {
      let response;
      const userId = await getUserId();
      if (userTicketsOnly && userId) {
        // Obtener tickets específicos del usuario
        response = await listTicketsByUser(
          userId.data,
          page,
        );
      } else if (filterStatus) {
        // Obtener tickets filtrados por estado
        response = await listFilteredTickets(
          page,
          filterStatus,
          filterDepartamento
        );
      } else {
        // Obtener todos los tickets
        response = await listTickets(page, filterDepartamento);
      }

      
      setTickets(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setErrorConexion(true);
      showErrorToast("Error al obtener los tickets.");
      console.error("Error fetching tickets:", error);
      setTickets([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [userTicketsOnly]);

  // Efectos secundarios
  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  useEffect(() => {
    fetchTickets(pagina, status, selectedDepartamento);
  }, [pagina, status, selectedDepartamento, fetchTickets]);

  useEffect(() => {
    setPagina(0);
  }, [status, selectedDepartamento, userTicketsOnly]);

  useEffect(() => {
    localStorage.setItem("selectedTab", selected);
  }, [selected]);

  // Handlers
  const handleTabChange = useCallback((index) => {
    setSelected(index);
  }, []);

  const handleDepartamentoChange = useCallback((departamento) => {
    setSelectedDepartamento(departamento);
  }, []);

  const handleCreateTicket = () => {
    toast.info("Creando ticket...");
    setOpenDialog(true);
  };

  function nextPage() {
    if (pagina < totalPages - 1) {
      setPagina(pagina + 1);
    }
  }

  function prevPage() {
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  }

  /**
   * @function getPageTitle
   * @description Genera el título de la página según los filtros aplicados
   */
  const getPageTitle = () => {
    let title = userTicketsOnly ? "Mis Tickets" : "Todos los Tickets";
    
    if (status) {
      title += ` ${status.replace("-", " ")}`;
    }
    
    if (selectedDepartamento && departamentos.length > 0) {
      const dept = departamentos.find(d => d.nombre.toString() === selectedDepartamento);
      if (dept) {
        title += ` en ${dept.nombre}`;
      }
    }
    
    return title;
  };

  // Renderizado condicional durante la carga
  if (loading) {
    return (
      <div className="py-10 text-center" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando tickets...</p>
      </div>
    );
  }

  return (
    <Transition
      as="div"
      appear
      show={!loading}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className="w-full"
    >
      <Title title={getPageTitle()} />
      
      <Tabs
        tabs={TABS}
        selected={selected}
        setSelected={handleTabChange}
        status={status}
        departamentos={departamentos}
        selectedDepartamento={selectedDepartamento}
        onDepartamentoChange={handleDepartamentoChange}
        onCreateTicket={handleCreateTicket}
      >
        {!status && selected === 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-12 py-4">
            {/* Títulos de columnas para vista de cuadrícula */}
          </div>
        )}

        {selected === 0 ? (
          <BoardView tickets={tickets} />
        ) : (
          <div className="pb-2 w-full overflow-x-auto">
            <Table tickets={tickets} />
          </div>
        )}
      </Tabs>

      {totalPages > 1 && (
        <PaginationBar
          currentPage={pagina}
          totalPages={totalPages}
          onPrev={prevPage}
          onNext={nextPage}
          isPrevDisabled={pagina === 0}
          isNextDisabled={pagina >= totalPages - 1}
        />
      )}

      {errorConexion && (
        <div className="text-red-600 text-center mt-4 px-4 py-2 border border-red-300 bg-red-50 rounded">
          Error al cargar los tickets. Por favor, revisa tu conexión e inténtalo de nuevo.
        </div>
      )}

      {!loading && !errorConexion && tickets.length === 0 && (
        <div className="text-gray-500 text-center mt-4">
          {userTicketsOnly 
            ? "No has creado ningún ticket aún."
            : `No se encontraron tickets${status ? ` con el estado "${status.replace("-", " ")}"` : ""}${selectedDepartamento ? ` en el departamento seleccionado` : ""}.`
          }
          {userTicketsOnly && (
            <button
              onClick={handleCreateTicket}
              className="mt-2 block mx-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Crear mi primer ticket
            </button>
          )}
        </div>
      )}

      <CreateTicket 
        open={openDialog} 
        setOpen={setOpenDialog}
        onTicketCreated={() => {
          fetchTickets(pagina, status, selectedDepartamento);
        }}
      />
    </Transition>
  );
};

export default Tasks;