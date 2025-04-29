// c:\React\Proyecto-Fullstack\frontend\src\pages\Helpdesk\TaskDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../../services/TicketService";
import { listTickets } from "../../services/TicketService";
import { toast } from "sonner";
import {
  FaPaperPlane,
  FaComments,
  FaTicketAlt,
  FaInfoCircle,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa"; // Iconos para mejorar la UI
import { listMessages } from "../../services/ChatService";
import Chat from "../../components/Chat"

/**
 * @component TaskDetails
 * @description Muestra los detalles completos de un ticket específico obtenido por su ID.
 * Incluye información del ticket y una sección placeholder para un futuro chat.
 * @returns {JSX.Element} El componente renderizado con los detalles del ticket.
 */
const TaskDetails = () => {
  const params = useParams();
  /**
   * @description ID del ticket obtenido de los parámetros de la URL.
   * @type {string}
   */
  const id = params?.id || "";

  /**
   * @state loading
   * @description Indica si los datos del ticket se están cargando.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true); // Inicia en true ya que siempre cargará al inicio

  /**
   * @state ticket
   * @description Almacena los datos del ticket obtenidos de la API. Null si no se encuentra o hay error.
   * @type {object | null}
   */
  const [ticket, setTicket] = useState(null);

  /**
   * @state error
   * @description Almacena un mensaje de error si la carga falla.
   * @type {string | null}
   */
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      listMessages(id).then((response) => {
        if (response.data) {
          console.log(response.data.content);
        }
      });
    }
  }, []);

  /**
   * @effect fetchTicketDetails
   * @description Efecto para obtener los detalles del ticket cuando el componente se monta o el ID cambia.
   * Actualiza los estados `loading`, `ticket`, y `error`.
   */
  useEffect(() => {
    // Solo ejecuta si hay un ID válido
    if (id) {
      setLoading(true);
      setError(null); // Resetea el error en cada nueva carga
      getTicketById(id)
        .then((response) => {
          if (response.data) {
            setTicket(response.data);
          } else {
            // Si la API devuelve una respuesta exitosa pero sin datos (poco común, pero posible)
            setError("No se encontraron datos para este ticket.");
            setTicket(null);
            toast.warning("Ticket no encontrado.");
          }
        })
        .catch((err) => {
          console.error("Error al cargar el ticket:", err); // Log detallado para depuración
          const errorMessage =
            err.response?.data?.message ||
            "Error al cargar el ticket. Inténtalo de nuevo.";
          setError(errorMessage);
          setTicket(null);
          toast.error(errorMessage); // Muestra error al usuario
        })
        .finally(() => setLoading(false)); // Desactiva el loading al finalizar (éxito o error)
    } else {
      // Si no hay ID en la URL
      setError("No se proporcionó un ID de ticket válido.");
      setLoading(false);
      toast.error("ID de ticket inválido.");
    }
  }, [id]); // Dependencia: se re-ejecuta si el ID cambia

  // --- Renderizado Condicional ---

  // Estado de Carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          {/* Puedes reemplazar esto con un componente Spinner más elaborado */}
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-gray-600">
            Cargando detalles del ticket...
          </p>
        </div>
      </div>
    );
  }

  // Estado de Error o Ticket No Encontrado
  if (error || !ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="text-center bg-white rounded-lg shadow-md p-3">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <div className="text-2xl font-semibold text-red-700 mb-2">Error</div>
          <p className="text-gray-600">
            {error || "El ticket solicitado no pudo ser encontrado."}
          </p>
          {/* Opcional: Botón para volver atrás o a la lista de tickets */}
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // --- Renderizado Principal (Ticket Encontrado) ---
  return (
    <div className="min-h-fit p-4 md:p-8">
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Volver
      </button>
      <div className="pt-2 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Columna Izquierda: Detalles del Ticket */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-2 text-3xl font-semibold text-gray-800 mb-6 border-b pb-3 flex items-center">
            <FaTicketAlt className="mr-3 text-blue-600" />
            Detalles del Ticket:{" "}
            <span className="ml-2 font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              {ticket.codigo || ticket.id}
            </span>
          </div>

          <div className="space-y-5">
            {/* Sección Información General */}
            <DetailSection
              title="Información General"
              icon={<FaInfoCircle className="text-green-600" />}
            >
              <DetailItem label="Tema" value={ticket.tema} />
              <DetailItem
                label="Estado"
                value={ticket.estadoNombre}
                badgeColor={getBadgeColor(ticket.estado)}
              />
              <DetailItem
                label="Prioridad"
                value={ticket.prioridadNombre}
                badgeColor={getPriorityColor(ticket.prioridad)}
              />
              <DetailItem
                label="Departamento"
                value={ticket.departamentoNombre}
              />
              <DetailItem label="Incidencia" value={ticket.incidenciaNombre} />
              <DetailItem label="Motivo" value={ticket.motivoNombre} />
              <DetailItem label="Fuente" value={ticket.fuenteNombre} />
            </DetailSection>

            {/* Sección Fechas */}
            <DetailSection
              title="Fechas Relevantes"
              icon={<FaCalendarAlt className="text-purple-600" />}
            >
              <DetailItem
                label="Fecha de Creación"
                value={formatDateTime(ticket.fechaCreacion)}
                icon={<FaClock className="text-gray-400" />}
              />
              <DetailItem
                label="Última Actualización"
                value={formatDateTime(ticket.fechaActualizacion)}
                icon={<FaClock className="text-gray-400" />}
              />
              <DetailItem
                label="Fecha de Vencimiento"
                value={formatDateTime(ticket.fechaVencimiento)}
                icon={<FaClock className="text-gray-400" />}
              />
            </DetailSection>

            {/* Sección Usuarios */}
            <DetailSection
              title="Usuarios"
              icon={<FaUser className="text-yellow-600" />}
            >
              <DetailItem
                label="Usuario Creador"
                value={ticket.usuarioCreadorNombres || "No asignado"}
              />
              <DetailItem
                label="Usuario Asignado"
                value={ticket.usuarioAsignadoNombres || "No asignado"}
              />
              {/* Podrías añadir más detalles del usuario si están disponibles, como email o rol */}
            </DetailSection>
          </div>
        </div>

        {/* Columna Derecha: Chat (Placeholder) */}
        <Chat/>
      </div>
    </div>
  );
};

// --- Componentes Auxiliares para Estructura ---

/**
 * @component DetailSection
 * @description Componente para agrupar detalles relacionados bajo un título con icono.
 * @param {object} props
 * @param {string} props.title - Título de la sección.
 * @param {React.ReactNode} props.icon - Icono para la sección.
 * @param {React.ReactNode} props.children - Contenido de la sección (DetailItems).
 * @returns {JSX.Element}
 */
const DetailSection = ({ title, icon, children }) => (
  <div className="font-semibold border border-gray-200 rounded-md p-2 m-2">
    <div className="text-2xl font-medium text-gray-700 mb-3 flex items-center">
      {icon &&
        React.cloneElement(icon, {
          className: `${icon.props.className} p mr-2 w-5 h-5`,
        })}
      {title}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

/**
 * @component DetailItem
 * @description Muestra un par etiqueta-valor para un detalle del ticket.
 * @param {object} props
 * @param {string} props.label - La etiqueta del detalle.
 * @param {string | number | null | undefined} props.value - El valor del detalle.
 * @param {string} [props.badgeColor] - Color de fondo para el valor si se quiere mostrar como badge (Tailwind class).
 * @param {React.ReactNode} [props.icon] - Icono opcional junto al valor.
 * @returns {JSX.Element}
 */
const DetailItem = ({ label, value, badgeColor, icon }) => (
  <div className="grid grid-cols-3 gap-x-4 items-start">
    <dt className="text-sm font-medium text-gray col-span-1">{label}:</dt>
    <dd
      className={`text-sm text-gray-900 col-span-2 flex items-center ${
        badgeColor ? "inline-block" : ""
      }`}
    >
      {icon &&
        React.cloneElement(icon, {
          className: `${icon.props.className} mr-1.5 w-4 h-4`,
        })}
      {badgeColor ? (
        <span
          className={`px-1 py-0.5 rounded-full font-semibold ${badgeColor}`}
        >
          {value || "N/A"}
        </span>
      ) : (
        value || (
          <span className="text-gray-400 italic m-5">No especificado</span>
        )
      )}
    </dd>
  </div>
);

// --- Funciones Auxiliares ---

/**
 * @function formatDateTime
 * @description Formatea una cadena de fecha/hora ISO a un formato legible.
 * @param {string | null | undefined} dateTimeString - La cadena de fecha/hora ISO.
 * @returns {string} La fecha/hora formateada o 'N/A'.
 */
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: '2-digit', minute: '2-digit' // Descomenta si quieres la hora
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateTimeString;
  }
};

/**
 * @function getBadgeColor
 * @description Devuelve clases de Tailwind para un badge de estado.
 * @param {string | number | null | undefined} status - El estado del ticket (puede ser string o número).
 * @returns {string} Clases CSS de Tailwind.
 */
const getBadgeColor = (status) => {
  // --- INICIO CAMBIO ---
  // 1. Convierte a string explícitamente.
  // 2. Usa '??' para manejar null/undefined y asignar ''.
  // 3. Llama a toLowerCase() sobre la cadena resultante.
  const lowerStatus = String(status ?? "").toLowerCase();
  // --- FIN CAMBIO ---

  switch (lowerStatus) {
    case "pendiente":
    case "1": // Añade casos numéricos si tu API los devuelve
      return "bg-red-100 text-red-800";
    case "en proceso":
    case "en-proceso":
    case "2": // Añade casos numéricos si tu API los devuelve
      return "bg-green-100 text-green-800";
    case "completado":
    case "3": // Añade casos numéricos si tu API los devuelve
      return "bg-yellow-100 text-yellow-800";
    case "cancelado":
    case "4": // Añade casos numéricos si tu API los devuelve
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * @function getPriorityColor
 * @description Devuelve clases de Tailwind para un badge de prioridad.
 * @param {string | number | null | undefined} priority - La prioridad del ticket (puede ser string o número).
 * @returns {string} Clases CSS de Tailwind.
 */
const getPriorityColor = (priority) => {
  // --- INICIO CAMBIO ---
  // Aplica la misma lógica de conversión segura a string
  const lowerPriority = String(priority ?? "").toLowerCase();
  // --- FIN CAMBIO ---

  switch (lowerPriority) {
    case "alta":
    case "high": // Considera otros posibles valores
    case "3": // Ejemplo numérico
      return "bg-red-100 text-red-800";
    case "media":
    case "medium":
    case "2": // Ejemplo numérico
      return "bg-yellow-100 text-yellow-800";
    case "baja":
    case "low":
    case "1": // Ejemplo numérico
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default TaskDetails;
