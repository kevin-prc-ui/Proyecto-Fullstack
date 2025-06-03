import React, { useCallback, useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
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
import { listTickets, listFilteredTickets } from "../../services/TicketService";
import { listAllDepartamentos } from "../../services/DepartamentoService";
/**
 * @constant TABS
 * @description Configuración para las pestañas de visualización (Cuadrícula y Lista).
 * @type {Array<object>}
 */
const TABS = [
  { title: "Cuadricula", icon: <MdGridView /> },
  { title: "Lista", icon: <FaList /> },
];

/**
 * @component Tasks
 * @description Componente principal para mostrar y gestionar la lista de tickets.
 * Permite visualizar los tickets en formato de cuadrícula (Board) o tabla (Lista),
 * filtrar por estado, paginar los resultados y manejar estados de carga y error.
 * @returns {JSX.Element} El componente renderizado.
 */
const Tasks = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const params = useParams();
  const isAuth = localStorage.getItem("authToken"); // Verifica si el usuario está autenticado

  /**
   * @state pagina
   * @description Índice de la página actual (base 0) para la paginación.
   * @type {number}
   */
  const [pagina, setPagina] = useState(0);

  /**
   * @state loading
   * @description Indica si los datos de los tickets se están cargando.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(false);

  /**
   * @state tickets
   * @description Array que almacena los tickets obtenidos de la API.
   * @type {Array<object>}
   */
  const [tickets, setTickets] = useState([]);

  /**
   * @state errorConexion
   * @description Indica si ocurrió un error al intentar obtener los tickets.
   * @type {boolean}
   */
  const [errorConexion, setErrorConexion] = useState(false);

  /**
   * @state totalPages
   * @description Número total de páginas disponibles según la API.
   * @type {number}
   */
  const [totalPages, setTotalPages] = useState(0);

  /**
   * @state selected
   * @description Índice de la pestaña de visualización seleccionada (0 para Cuadrícula, 1 para Lista).
   * Intenta recuperar la última pestaña seleccionada desde localStorage o usa 0 por defecto.
   * @type {number}
   */
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedTab");
    // Asegura que el valor recuperado sea un número válido (0 o 1), si no, usa 0.
    const initialSelected = saved !== null ? Number(saved) : 0;
    return [0, 1].includes(initialSelected) ? initialSelected : 0;
  });

  // --- New State for Departamentos ---
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState(""); // Store selected department ID, "" means all
  // --- End of New State ---

  /**
   * @description Estado del ticket extraído de los parámetros de la URL (ej. "pendiente", "en-proceso").
   * Si no hay estado en la URL, es una cadena vacía.
   * @type {string}
   */
  const status = params?.estado || "";

  /**
   * @function handleTabChange
   * @description Callback para manejar el cambio de pestaña de visualización.
   * Actualiza el estado `selected`.
   * @param {number} index - El índice de la nueva pestaña seleccionada.
   * @returns {void}
   */
  const handleTabChange = useCallback((index) => {
    setSelected(index);
  }, []); // No tiene dependencias externas que cambien

  /**
   * @effect Guarda la pestaña seleccionada en localStorage cada vez que cambia.
   */
  useEffect(() => {
    localStorage.setItem("selectedTab", selected);
  }, [selected]);

  /**
   * @function showErrorToast
   * @description Muestra un mensaje de error usando `toast`. Se envuelve en `setTimeout`
   * para asegurar que se ejecute después de cualquier actualización de estado pendiente.
   * @param {string} message - El mensaje de error a mostrar.
   * @returns {void}
   */
  const showErrorToast = (message) => setTimeout(() => toast.error(message), 0);

  /**
   * @function fetchTickets
   * @description Obtiene los tickets desde la API, ya sea todos o filtrados por estado.
   * Actualiza los estados `tickets`, `totalPages`, `loading` y `errorConexion`.
   * @param {number} page - El número de página a solicitar (base 0).
   * @param {string} [filterStatus=""] - El estado por el cual filtrar los tickets (opcional).
   * @returns {Promise<void>}
   */

  // --- Fetch Departamentos ---
  const fetchDepartamentos = useCallback(async () => {
    if (!isAuth) return; // Don't fetch if not authenticated
    try {
      const response = await listAllDepartamentos();
      // Assuming response.data is an array of department objects { id: '...', name: '...' }
      setDepartamentos(response.data || []);
    } catch (error) {
      showErrorToast("Error al cargar los departamentos.");
      console.error("Error fetching departamentos:", error);
      setDepartamentos([]); // Clear departamentos on error
    }
  }, [isAuth]); // Dependency on isAuth

  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]); // Fetch departamentos on mount or when fetchDepartamentos changes (due to isAuth)

  const fetchTickets = useCallback(
    async (page, filterStatus = "", filterDepartamento = "") => {
      setLoading(true);
      setErrorConexion(false);
      try {
        let response;
        // Pass departmentId to the service functions
        if (filterStatus) {
          response = await listFilteredTickets(
            page,
            filterStatus,
            filterDepartamento
          );
        } else {
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
    },
    []
  ); // Array de dependencias vacío es aceptable aquí.

  /**
   * @effect Ejecuta `fetchTickets` cuando cambian la autenticación, la página,
   * el estado del filtro o la propia función `fetchTickets` (aunque esta última es estable por `useCallback`).
   * Se activa al montar el componente y cada vez que una de estas dependencias cambia.
   */
  // --- Update useEffect to fetch tickets when department changes ---
  useEffect(() => {
      // Pass selectedDepartamento to fetchTickets
      fetchTickets(pagina, status, selectedDepartamento);
    // Add selectedDepartamento to the dependency array
  }, [pagina, status, selectedDepartamento]);

  /**
   * @effect Reinicia la paginación a la primera página (índice 0)
   * cada vez que cambia el filtro de estado (`status`).
   */

  // --- Update useEffect to reset page when department changes ---
  useEffect(() => {
    setPagina(0);
  }, [status, selectedDepartamento]); // Reset page if status OR department changes

  // --- Handler for Departamento Change ---
  const handleDepartamentoChange = useCallback((departamento) => {
    setSelectedDepartamento(departamento);
    // No need to call fetchTickets here, the useEffect above will handle it
  }, []); // No dependencies needed as setSelectedDepartamento is stable

  // --- Navigation Handler for Create Ticket ---
  const handleCreateTicket = () => {
    toast.info("Creando ticket...");
    setOpenDialog(true);
  };
  // --- End Navigation Handler ---

  /**
   * @function nextPage
   * @description Incrementa el índice de la página actual (`pagina`) si no se está en la última página.
   * @returns {void}
   */
  function nextPage() {
    // Evita ir más allá de la última página
    if (pagina < totalPages - 1) {
      setPagina(pagina + 1);
    }
  }

  /**
   * @function prevPage
   * @description Decrementa el índice de la página actual (`pagina`) si no se está en la primera página.
   * @returns {void}
   */
  function prevPage() {
    // Evita ir por debajo de la primera página (índice 0)
    if (pagina > 0) {
      setPagina(pagina - 1);
    }
  }

  // Determine the title based on filters
  const getPageTitle = () => {
    let title = "Tickets";
    if (status) {
      title += ` ${status.replace("-", " ")}`;
    }
    if (selectedDepartamento && departamentos.length > 0) {
      const dept = departamentos.find(
        (d) => d.nombre.toString() === selectedDepartamento
      );
      if (dept) {
        title += ` en ${dept.nombre}`;
      }
    }
    if (!status && !selectedDepartamento) {
      title = "Todos los Tickets";
    }
    return title;
  };

  /**
   * @function getTaskTypeClass
   * @description Devuelve la clase CSS correspondiente al estado del ticket.
   * Utiliza el objeto `TASK_TYPE` importado. Proporciona una clase por defecto si el estado no se encuentra.
   * @param {string} statusKey - La clave del estado (ej. "pendiente", "en-proceso"). Debe coincidir con las claves en `TASK_TYPE`.
   * @returns {string} La clase CSS (ej. "bg-blue-600") o una clase por defecto ("bg-gray-400").
   */


  // Renderizado condicional mientras se cargan los datos
  if (loading) {
    return (
      <div className="py-10 text-center" role="status" aria-live="polite">
        {/* Indicador de carga simple pero accesible */}
        Cargando tickets...
        {/* Se podría reemplazar con un componente Spinner más visual si se desea */}
        {/* Ejemplo de estructura de puntos (descomentar CSS si se usa):
          <div className="dots-container">
            <div className="dot"></div> <div className="dot"></div> <div className="dot"></div>
          </div>
        */}
      </div>
    );
  }

  // Renderizado principal del componente
  return (
    <Transition
      as="div" // Renderiza como un div
      appear // Ejecuta la transición al montar
      show={!loading} // Muestra el contenido solo cuando no está cargando
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className="w-full" // Asegura que ocupe todo el ancho disponible
    >
      <Title title={getPageTitle()} />
      {/* Pestañas para cambiar entre vista de Cuadrícula y Lista */}
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
        {/* Renderizado condicional de los títulos de columna (solo en vista Cuadrícula y sin filtro de estado) */}
        {!status &&
          selected === 0 && ( // Mostrar títulos solo si no hay filtro de estado Y se está en la vista Cuadrícula (selected === 0)
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-x-12 py-4">
              {/* Asegúrate que las claves coincidan exactamente con tu objeto TASK_TYPE */}
            </div>
          )}

        {/* Renderizado condicional de la vista de tickets (Cuadrícula o Tabla) */}
        {selected === 0 ? ( // Si selected es 0, muestra BoardView (Cuadrícula)
          <BoardView tickets={tickets} />
        ) : (
          // Si no, muestra Table (Lista)
          // Se envuelve en un div con overflow-x-auto para manejar tablas anchas en pantallas pequeñas
          <div className="pb-2 w-full overflow-x-auto">
            <Table tickets={tickets} />
          </div>
        )}
      </Tabs>

      {/* Barra de paginación: solo se muestra si hay más de una página */}
      {totalPages > 1 && (
        <PaginationBar
          currentPage={pagina} // Pasa el índice actual (base 0)
          totalPages={totalPages}
          onPrev={prevPage}
          onNext={nextPage}
          // Deshabilita los botones de forma apropiada
          isPrevDisabled={pagina === 0}
          isNextDisabled={pagina >= totalPages - 1}
        />
      )}

      {/* Mensaje de error en caso de fallo al cargar los tickets */}
      {errorConexion && (
        <div className="text-red-600 text-center mt-4 px-4 py-2 border border-red-300 bg-red-50 rounded">
          Error al cargar los tickets. Por favor, revisa tu conexión e inténtalo
          de nuevo.
        </div>
      )}

      {/* Mensaje cuando no hay tickets para mostrar (y no hay error ni carga) */}
      {!loading && !errorConexion && tickets.length === 0 && (
        <div className="text-gray-500 text-center mt-4">
          No se encontraron tickets
          {status ? ` con el estado "${status.replace("-", " ")}"` : ""}
          {selectedDepartamento ? ` en el departamento seleccionado` : ""}.
        </div>
      )}
      <CreateTicket open={openDialog} setOpen={setOpenDialog} />
    </Transition>
  );
};

export default Tasks;
