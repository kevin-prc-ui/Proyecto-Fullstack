import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../../services/TicketService";
import { listMessages } from "../../services/ChatService";
import { toast } from "sonner";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // Lo mantendremos para la compatibilidad con SockJS
import {
  FaTicketAlt, FaInfoCircle, FaUser,
  FaCalendarAlt, FaClock, FaExclamationTriangle, FaSpinner,
} from "react-icons/fa";
import ChatComponent from "../../components/Chat";

// --- Configuración actualizada ---
const WEBSOCKET_URL = 'http://localhost:8080/ws'; // Cambiado a HTTP para SockJS
const CHAT_SUB_TOPIC = '/topic/ticket/chat/'; // Asegúrate que coincida con tu backend
const CHAT_SEND_ENDPOINT = '/app/topic/'; // Endpoint para enviar mensajes

const MOCK_CURRENT_USER_ID = 2;

const TaskDetails = () => {
  const params = useParams();
  const id = params?.id || "";
  
  // --- Estados ---
  const [loadingTicket, setLoadingTicket] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [ticketError, setTicketError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatError, setChatError] = useState(null);
  const subscriptionRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // --- Conexión WebSocket con SockJS ---
  const connectWebSocket = useCallback((chatId) => {
    if (stompClient && stompClient.connected) {
      return;
    }

    console.log(`Iniciando conexión WebSocket para chat ID: ${chatId}`);
    setChatError(null);

    // Crear una instancia de SockJS
    const socket = new SockJS(WEBSOCKET_URL);
    
    // Crear cliente STOMP sobre SockJS
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('STOMP Debug:', str),
      
      onConnect: (frame) => {
        console.log('Conectado correctamente:', frame);
        reconnectAttempts.current = 0;
        setIsConnected(true);
        setChatError(null);

        const topic = `${CHAT_SUB_TOPIC}${chatId}`;
        console.log(`Suscrito a ${topic}`);
        
        subscriptionRef.current = client.subscribe(topic, (message) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            console.log('Mensaje recibido:', receivedMessage);
            setChatMessages(prev => [...prev, receivedMessage]);
          } catch (e) {
            console.error("Error al procesar mensaje:", e);
            toast.error("Error al procesar mensaje recibido.");
          }
        }, { id: `sub-${chatId}` });
        
        toast.success("Chat conectado.");
      },
      
      onStompError: (frame) => {
        console.error('Error STOMP:', frame.headers['message']);
        setChatError(`Error STOMP: ${frame.headers['message'] || 'Error desconocido'}`);
        toast.error("Error de conexión con el chat.");
      },
      
      onWebSocketError: (event) => {
        console.error("Error WebSocket:", event);
        setIsConnected(false);
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          setChatError(`Intentando reconectar (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
        } else {
          setChatError("No se pudo conectar al chat. Por favor recarga la página.");
          toast.error("Error de conexión persistente con el chat.");
        }
      },
      
      onDisconnect: () => {
        console.log('Desconectado');
        setIsConnected(false);
        if (!chatError) {
          setChatError("Chat desconectado. Reconectando...");
        }
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [stompClient]);

  // --- Efecto para manejar el ticket y la conexión ---
  useEffect(() => {
    if (!id) {
      setTicketError("ID de ticket inválido.");
      setLoadingTicket(false);
      toast.error("ID de ticket inválido.");
      return;
    }

    setLoadingTicket(true);
    setTicketError(null);
    
    getTicketById(id)
      .then((response) => {
        if (response.data) {
          setTicket(response.data);
          fetchInitialMessages(response.data.chatId);
          
          // Conectar WebSocket solo si tenemos chatId
          if (response.data.chatId) {
            connectWebSocket(response.data.chatId);
          }
        }
      })
      .catch((err) => {
        console.error("Error al cargar ticket:", err);
        setTicketError(err.response?.data?.message || "Error al cargar el ticket.");
        toast.error("Error al cargar el ticket.");
      })
      .finally(() => setLoadingTicket(false));

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        console.log("WebSocket desconectado al limpiar");
      }
    };
  }, [id]);

  // --- Resto del código permanece igual ---
  const fetchInitialMessages = useCallback((chatId) => {
    setIsLoadingMessages(true);
    setChatMessages([]);
    listMessages(id)
      .then((response) => {
        if (response.data?.content) {
          setChatMessages(response.data.content);
        } else {
          setChatMessages([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar mensajes:", err);
        toast.error("No se pudieron cargar los mensajes.");
        setChatMessages([]);
      })
      .finally(() => setIsLoadingMessages(false));
  }, [id]);

  const handleSendMessage = useCallback((messageContent, files) => {
    if (!stompClient || !isConnected || !ticket?.chatId) {
      toast.error("No se puede enviar mensaje. Chat no conectado.");
      return;
    }

    if (!messageContent.trim() && files.length === 0) return;

    if (files.length > 0) {
      console.warn("Envío de archivos no implementado aún.");
      toast.info("La subida de archivos no está implementada aún.");
      if (!messageContent.trim()) return;
    }

    const destination = `${CHAT_SEND_ENDPOINT}${ticket.chatId}/sendMessage`;
    const chatMessage = {
      content: messageContent,
      senderId: MOCK_CURRENT_USER_ID
    };

    try {
      stompClient.publish({
        destination: destination,
        body: JSON.stringify(chatMessage),
        headers: { 'content-type': 'application/json' }
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar el mensaje.");
    }
  }, [stompClient, isConnected, ticket?.chatId]);

  // --- Renderizado (igual que antes) ---
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

  if (ticketError || !ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center rounded-lg shadow-lg p-6 max-w-md">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-gray-600">
            {ticketError || "El ticket solicitado no pudo ser encontrado."}
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

  return (
    <div className="min-h-fit min-w-250 p-4 md:p-6">
      <button
        onClick={() => window.history.back()}
        className="mb-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
      >
        &larr; Volver
      </button>
      
      <div className="max-w-7x2 mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Detalles del ticket (igual que antes) */}
        <div className="lg:w-1/2 xl:w-2/5 flex-shrink-0 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* ... */}
        </div>

        {/* Componente de chat */}
        <div className="flex-1 lg:w-1/2 xl:w-3/5 min-h-[600px] lg:min-h-0">
          <ChatComponent
            chatId={ticket.chatId}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
            isLoadingMessages={isLoadingMessages}
            currentUserId={MOCK_CURRENT_USER_ID}
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
