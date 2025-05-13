// ChatContainer.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatComponent from "../Chat/ChatComponent";
import { listMessages, postChatMessage } from "../../services/ChatService";
import { getUserId } from "../../services/UsuarioService";

const ChatContainer = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [connectionError, setConnectionError] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [usuario, setUsuario] = useState(null); // TODO: Obtener el ID del usuario actual de tu sistema de autenticación
  const token = () => localStorage.getItem("authToken");
  const getAuthToken = () => JSON.parse(token()).accessToken;


  // Function to create headers with the Authorization token
  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  

  // Cargar mensajes históricos
  const loadChatHistory = useCallback(async () => {
    try {
      const response = await listMessages(ticketId);

      setMessages(response.data.content);
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      setConnectionError("Error al cargar el historial de mensajes");
    } finally {
      setIsLoadingMessages(false);
    }
  }, [ticketId]);

  // Configurar WebSocket y encontrar usuario actual
  useEffect(() => {
    console.log("Intentando Conexion...");

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${getHeaders()}`,
      },
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket conectado");
        setIsConnected(true);
        setConnectionError("");

        // Suscribirse al canal del chat
        client.subscribe(`/topic/chat/${ticketId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        // Cargar mensajes históricos después de conectar
        loadChatHistory();
      },
      onDisconnect: () => {
        console.log("WebSocket desconectado");
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("Error STOMP:", frame);
        setConnectionError("Error de conexión con el servidor");
      },
    });

    setStompClient(client);
    client.activate();

    getUserId().then((response) => {
        setUsuario(response.data);
      });
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
    
  }, [ticketId, loadChatHistory]);

  // Función para enviar mensajes
  const handleSendMessage = async (messageContent, files) => {
    if (
      !isConnected ||
      (!messageContent.trim() && (!files || files.length === 0))
    )
      return;

    try {
      // const formData = new FormData();
      const messageDto = {
        content: messageContent,
        ticketId: ticketId,
      };

      // formData.append(
      //   "message",
      //   new Blob([JSON.stringify(messageDto)], {
      //     type: "application/json",
      //   })
      // );

      // Enviar mensaje a través de HTTP para manejar archivos
      const response = await postChatMessage(ticketId, messageDto);
      if (!response.ok) throw new Error("Error al enviar mensaje");
      // Enviar notificación a través de WebSocket
      stompClient.publish({
        destination: `/app/chat/${ticketId}`,
        body: JSON.stringify({
          content: messageContent,
          ticketId: ticketId,
        }),
      });
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setConnectionError("Error al enviar el mensaje");
    }
  };

  return (
    <ChatComponent
      chatId={ticketId}
      messages={messages}
      onSendMessage={handleSendMessage}
      isConnected={isConnected}
      isLoadingMessages={isLoadingMessages}
      currentUserId={usuario}
      connectionError={connectionError}
      ticketId={ticketId}
    />
  );
};

export default ChatContainer;
