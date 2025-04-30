// c:\React\Proyecto\frontend\src\pages\Helpdesk\TaskDetails.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../../services/TicketService";
// Assuming listMessages fetches messages for a TICKET ID and backend links it to chat
import { listMessages } from "../../services/ChatService";
import { toast } from "sonner";
import { Client } from '@stomp/stompjs'; // Import StompJS Client
import {
  FaPaperPlane, FaComments, FaTicketAlt, FaInfoCircle, FaUser,
  FaCalendarAlt, FaClock, FaExclamationTriangle, FaSpinner,
} from "react-icons/fa";
import ChatComponent from "../../components/Chat"; // Renamed import for clarity

// --- Configuration ---
const WEBSOCKET_URL = 'ws://localhost:8080/ws'; // Replace with your backend WebSocket URL
const CHAT_SUB_TOPIC = '/ticket/chat/'; // Base topic for chat subscriptions
const CHAT_SEND_ENDPOINT = '/app/chat/'; // Base endpoint for sending messages

// --- Mock Current User ID (Replace with your actual auth logic) ---
const MOCK_CURRENT_USER_ID = 11; // Example: Get this from context or auth state

/**
 * @component TaskDetails
 * @description Muestra los detalles completos de un ticket y su chat asociado.
 */
const TaskDetails = () => {
  const params = useParams();
  const id = params?.id || ""; // Ticket ID

  // --- Ticket State ---
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [ticketError, setTicketError] = useState(null);

  // --- Chat State ---
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Separate loading for messages
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatError, setChatError] = useState(null); // WebSocket/STOMP specific errors
  const subscriptionRef = useRef(null); // To hold the subscription object

  // --- Fetch Ticket Details ---
  useEffect(() => {
    if (id) {
      setLoadingTicket(true);
      setTicketError(null);
      getTicketById(id)
        .then((response) => {
          if (response.data ) { // *** CRUCIAL: Check for chatId ***
            setTicket(response.data);
            // Fetch initial messages AFTER getting ticket details (and chatId)
            fetchInitialMessages(response.data.chatId); // Use chatId
          } //else if (response.data && !response.data.chatId) {
          //    setTicketError("Error: No se encontró el ID del chat asociado a este ticket. Contacte al administrador.");
          //    setTicket(null);
          //    toast.error("Falta información del chat para este ticket.");
          // }
          // else {
          //   setTicketError("No se encontraron datos para este ticket.");
          //   setTicket(null);
          //   toast.warning("Ticket no encontrado.");
          // }
        })
        .catch((err) => {
          console.error("Error al cargar el ticket:", err);
          const errorMessage = err.response?.data?.message || "Error al cargar el ticket.";
          setTicketError(errorMessage);
          setTicket(null);
          toast.error(errorMessage);
        })
        .finally(() => setLoadingTicket(false));
    } else {
      setTicketError("No se proporcionó un ID de ticket válido.");
      setLoadingTicket(false);
      toast.error("ID de ticket inválido.");
    }
    // Cleanup function for component unmount or ID change
    return () => {
        // Disconnect WebSocket when leaving the page or ID changes
        stompClient?.deactivate();
        setIsConnected(false);
        setStompClient(null);
        console.log("WebSocket client deactivated on cleanup.");
    };
  }, [id]); // Re-run if ticket ID changes

  // --- Fetch Initial Chat Messages ---
  const fetchInitialMessages = useCallback((chatId) => {
      // Note: Using listMessages which might expect ticketId.
      // Ideally, backend provides an endpoint like /api/chats/{chatId}/messages
      // Adjust this call based on your actual ChatService implementation.
      // For now, assuming listMessages(ticketId) works or you adapt it.
      setIsLoadingMessages(true);
      setChatMessages([]); // Clear previous messages
      listMessages(id) // Using ticket ID 'id' as per original code
        .then((response) => {
          if (response.data?.content) {
            // Assuming response.data.content is the array of ChatMessageDto
            setChatMessages(response.data.content);
            
          } else {
             console.warn("No initial messages found or unexpected response format:", response.data);
             setChatMessages([]); // Ensure it's an empty array
          }
        })
        .catch((err) => {
          console.error("Error al cargar mensajes iniciales:", err);
          toast.error("No se pudieron cargar los mensajes anteriores.");
          setChatMessages([]); // Ensure it's an empty array on error
        })
        .finally(() => setIsLoadingMessages(false));
  }, [id]); // Depend on ticket ID for the current listMessages service

  // --- WebSocket Connection Effect ---
  useEffect(() => {
    // Only connect if we have a ticket with a chatId and no active client
    if (ticket?.chatId && !stompClient) {
      console.log(`Attempting to connect WebSocket for chat ID: ${ticket.chatId}`);
      setChatError(null); // Reset error on new connection attempt

      const client = new Client({
        brokerURL: WEBSOCKET_URL,
        reconnectDelay: 5000, // Attempt reconnect every 5 seconds
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => { // Optional logging
          console.log('STOMP Debug:', str);
        },
        onConnect: (frame) => {
          console.log('WebSocket Connected:', frame);
          setIsConnected(true);
          setChatError(null); // Clear error on successful connect

          // Subscribe to the specific chat topic
          const topic = `${CHAT_SUB_TOPIC}${ticket.chatId}`;
          console.log(`Subscribing to ${topic}`);
          subscriptionRef.current = client.subscribe(topic, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log('Message received:', receivedMessage);
              // Update message list state
              setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
            } catch (e) {
              console.error("Error parsing received message:", e, message.body);
              toast.error("Error al procesar mensaje recibido.");
            }
          }, { id: `sub-${ticket.chatId}` }); // Optional: give subscription an ID
           toast.success("Chat conectado.");
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
          setIsConnected(false);
          setChatError(`Error del Broker: ${frame.headers['message'] || 'Error desconocido'}`);
          toast.error("Error de conexión con el chat (STOMP).");
        },
        onWebSocketError: (event) => {
          console.error("WebSocket error:", event);
          setIsConnected(false);
          setChatError("Error de conexión WebSocket. Intentando reconectar...");
          // No toast here, reconnectDelay handles retries silently unless it fails permanently
        },
        onDisconnect: (frame) => {
            console.log('WebSocket Disconnected:', frame);
            setIsConnected(false);
            // Don't set error on manual disconnect/cleanup
            if (stompClient) { // Avoid error message if it was manually deactivated
                 setChatError("Chat desconectado.");
                 toast.info("Chat desconectado.");
            }
            subscriptionRef.current = null; // Clear subscription ref
        },
      });

      client.activate();
      setStompClient(client);
    }

    // No return cleanup here, handled in the main useEffect [id]
  }, [ticket, stompClient]); // Depend on ticket (for chatId) and stompClient instance


  // --- Send Message Handler ---
  const handleSendMessage = useCallback((messageContent, files) => {
    if (!stompClient || !isConnected || !ticket?.chatId) {
      toast.error("No se puede enviar mensaje. Chat no conectado.");
      return;
    }

    if (!messageContent.trim() && files.length === 0) {
        return; // Don't send empty messages
    }

    // --- File Handling Placeholder ---
    if (files.length > 0) {
        // TODO: Implement file upload logic
        // 1. Show a loading indicator for the file(s)
        // 2. Upload each file via a separate HTTP POST request to a dedicated endpoint
        //    (e.g., /api/files/upload?chatId=...).
        // 3. On successful upload, the backend should return file details (URL, filename, type).
        // 4. Send a STOMP message of type 'FILE' including the file details received in step 3.
        console.warn("File sending not implemented yet. Sending text message only.");
        toast.info("La subida de archivos aún no está implementada.");
        // For now, we just proceed to send the text message if any.
        if (!messageContent.trim()) return; // Don't send if only files were selected and no text
    }

    // --- Send Text Message ---
    const destination = `${CHAT_SEND_ENDPOINT}${ticket.chatId}/sendMessage`;
    const chatMessage = {
      // Structure matching backend's ChatMessageCreateDto (or similar)
      content: messageContent,
      // messageType: 'TEXT', // Backend might infer this if content is present
      // senderId: MOCK_CURRENT_USER_ID // Backend should get sender from authenticated principal
    };

    try {
        console.log(`Sending message to ${destination}:`, chatMessage);
        stompClient.publish({
            destination: destination,
            body: JSON.stringify(chatMessage),
        });
        // Optimistic UI update could be added here if desired
    } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Error al enviar el mensaje.");
        setChatError("Error al enviar mensaje.");
    }

  }, [stompClient, isConnected, ticket?.chatId]);


  // --- Render Loading State ---
  if (loadingTicket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-lg font-medium text-gray-600">
            Cargando detalles del ticket...
          </p>
        </div>
      </div>
    );
  }

  // --- Render Error State ---
  if (ticketError || !ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-6 max-w-md">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-gray-600">
            {ticketError || "El ticket solicitado no pudo ser encontrado o está incompleto."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // --- Render Main Content (Ticket Details + Chat) ---
  return (
    <div className="min-h-fit min-w-250 bg-gray-50 p-4 md:p-6">
       <button
         onClick={() => window.history.back()}
         className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
       >
         &larr; Volver
       </button>
      <div className="max-w-7x2 mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Columna Izquierda: Detalles del Ticket */}
        <div className="lg:w-1/2 xl:w-2/5 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
             <h1 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaTicketAlt className="mr-3 text-blue-600" />
                Ticket:{" "}
                <span className="ml-2 font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-lg">
                  {ticket.codigo || ticket.id}
                </span>
             </h1>
          </div>

          <div className="p-4 space-y-5">
            {/* Sections remain the same as before */}
            <DetailSection title="Información General" icon={<FaInfoCircle className="text-green-600" />}>
              <DetailItem label="Tema" value={ticket.tema} />
              <DetailItem label="Estado" value={ticket.estadoNombre} badgeColor={getBadgeColor(ticket.estadoNombre)} />
              <DetailItem label="Prioridad" value={ticket.prioridadNombre} badgeColor={getPriorityColor(ticket.prioridadNombre)} />
              <DetailItem label="Departamento" value={ticket.departamentoNombre} />
              <DetailItem label="Incidencia" value={ticket.incidenciaNombre} />
              <DetailItem label="Motivo" value={ticket.motivoNombre} />
              <DetailItem label="Fuente" value={ticket.fuenteNombre} />
            </DetailSection>

            <DetailSection title="Fechas Relevantes" icon={<FaCalendarAlt className="text-purple-600" />}>
              <DetailItem label="Creación" value={formatDateTime(ticket.fechaCreacion)} icon={<FaClock className="text-gray-400" />} />
              <DetailItem label="Actualización" value={formatDateTime(ticket.fechaActualizacion)} icon={<FaClock className="text-gray-400" />} />
              <DetailItem label="Vencimiento" value={formatDateTime(ticket.fechaVencimiento)} icon={<FaClock className="text-gray-400" />} />
            </DetailSection>

            <DetailSection title="Usuarios" icon={<FaUser className="text-yellow-600" />}>
              <DetailItem label="Creador" value={ticket.usuarioCreadorNombres || "No asignado"} />
              <DetailItem label="Asignado" value={ticket.usuarioAsignadoNombres || "No asignado"} />
            </DetailSection>
          </div>
        </div>

        {/* Columna Derecha: Chat */}
        <div className="flex-1 lg:w-1/2 xl:w-3/5 min-h-[600px] lg:min-h-0">
          {/* Pass necessary props to ChatComponent */}
          <ChatComponent
            chatId={ticket.chatId}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
            isLoadingMessages={isLoadingMessages}
            currentUserId={MOCK_CURRENT_USER_ID} // *** Replace with actual user ID ***
            connectionError={chatError}
          />
        </div>
      </div>
    </div>
  );
};

// --- Componentes Auxiliares (DetailSection, DetailItem - unchanged) ---
const DetailSection = ({ title, icon, children }) => (
    <div className="border border-gray-200 rounded-md p-3">
      <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center border-b pb-2">
        {icon && React.cloneElement(icon, { className: `${icon.props.className} mr-2 w-4 h-4` })}
        {title}
      </h3>
      <div className="space-y-2 pl-1">{children}</div>
    </div>
  );

const DetailItem = ({ label, value, badgeColor, icon }) => (
    <div className="grid grid-cols-3 gap-x-2 items-start">
      <dt className="text-xs font-medium text-gray-500 col-span-1 truncate">{label}:</dt>
      <dd className={`text-xs text-gray-800 col-span-2 flex items-center ${badgeColor ? "inline-block" : ""}`}>
        {icon && React.cloneElement(icon, { className: `${icon.props.className} mr-1 w-3 h-3 flex-shrink-0` })}
        {badgeColor ? (
          <span className={`px-1.5 py-0.5 rounded-full font-semibold text-[11px] leading-tight ${badgeColor}`}>
            {value || "N/A"}
          </span>
        ) : (
          value || <span className="text-gray-400 italic">No especificado</span>
        )}
      </dd>
    </div>
  );


// --- Funciones Auxiliares (formatDateTime, getBadgeColor, getPriorityColor - slightly adapted) ---
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
          return "Fecha inválida";
      }
      return date.toLocaleDateString("es-ES", {
        year: "numeric", month: "short", day: "numeric",
        hour: '2-digit', minute: '2-digit' // Added time
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateTimeString; // Return original string on error
    }
  };

// Updated to use names directly as passed in ticket object
const getBadgeColor = (statusName) => {
    const lowerStatus = String(statusName ?? "").toLowerCase();
    switch (lowerStatus) {
      case "pendiente": return "bg-yellow-100 text-yellow-800";
      case "en proceso": return "bg-blue-100 text-blue-800";
      case "resuelto": return "bg-green-100 text-green-800";
      case "cerrado": return "bg-gray-200 text-gray-700";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

const getPriorityColor = (priorityName) => {
    const lowerPriority = String(priorityName ?? "").toLowerCase();
    switch (lowerPriority) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baja": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


export default TaskDetails;
