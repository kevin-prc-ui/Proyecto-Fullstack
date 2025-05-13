// c:\react\Proyecto\frontend\src\components\Chat\index.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaComments,
  FaPaperPlane,
  FaFileUpload,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { postChatMessage } from "../../services/ChatService";
import { toast } from "sonner";

// --- Helper Function to format timestamp ---
const formatChatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// --- Main Chat Component ---
const ChatComponent = ({
  chatId, // ID of the chat (needed for context, though sending is handled by parent)
  messages = [], // Array of message objects { id, sender: { id, nombres }, content, timestamp, messageType, ... }
  onSendMessage, // Function to call when sending a message: (messageContent: string, files: File[]) => void
  isConnected, // Boolean indicating WebSocket connection status
  isLoadingMessages, // Boolean indicating if initial messages are loading
  currentUserId, // ID of the currently logged-in user
  connectionError,
  ticketId, // Optional error message for connection issues
}) => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref to scroll to bottom

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- File Handling Logic (UI only for now) ---
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setFileError(""); // Clear previous errors

    const files = Array.from(e.dataTransfer.files);
    // Basic validation (can be expanded)
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setFileError(
          `Archivo no soportado: ${file.name} (Tipo: ${
            file.type || "desconocido"
          })`
        );
        return false;
      }
      if (file.size > maxSize) {
        setFileError(`Archivo demasiado grande: ${file.name} (Max: 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      // Only add valid files if some were invalid
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    } else {
      // Add all if all are valid
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      // Apply same validation as drop
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB
      setFileError(""); // Clear previous errors

      const validFiles = newFiles.filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          setFileError(
            `Archivo no soportado: ${file.name} (Tipo: ${
              file.type || "desconocido"
            })`
          );
          return false;
        }
        if (file.size > maxSize) {
          setFileError(`Archivo demasiado grande: ${file.name} (Max: 5MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length !== newFiles.length) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      } else {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
      // Clear the input value so the same file can be selected again
      e.target.value = null;
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (selectedFiles.length === 1) setFileError(""); // Clear error if last file removed
  };

  // --- Message Submission ---
 const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() && selectedFiles.length === 0) return;

    try {
        await postChatMessage(ticketId, message);
        // Limpiar estados
        setMessage("");
        setSelectedFiles([]);
        setFileError("");
        
    } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Error al enviar el mensaje");
    }
};
  

  // --- Render Logic ---
  return (
    <div className="flex-1 flex flex-col h-180 w-120 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <FaComments className="text-indigo-600 mr-3 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">
            Mensajes del Ticket
          </h2>
        </div>
        {/* Connection Status Indicator */}
        <div className="flex items-center text-xs">
          {connectionError ? (
            <FaExclamationCircle
              className="text-red-500 mr-1"
              title={connectionError}
            />
          ) : isConnected ? (
            <span
              className="w-3 h-3 bg-green-500 rounded-full mr-1"
              title="Conectado"
            ></span>
          ) : (
            <FaSpinner
              className="animate-spin text-yellow-500 mr-1"
              title="Conectando..."
            />
          )}
          <span
            className={`font-medium ${
              connectionError
                ? "text-red-600"
                : isConnected
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {connectionError
              ? "Error"
              : isConnected
              ? "Conectado"
              : "Conectando"}
          </span>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-2 overflow-y-auto bg-gray-100 space-y-4">
        {isLoadingMessages ? (
          <div className="text-center text-gray-500 py-10">
            <FaSpinner className="animate-spin h-6 w-6 mx-auto mb-2 text-indigo-500" />
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 italic py-10">
            No hay mensajes aún. ¡Sé el primero en escribir!
          </div>
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender?.id === currentUserId;
            return (
              <div
                key={msg.id || `temp-${Math.random()}`} // Use ID if available, fallback for optimistic updates
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                    isSender
                      ? "bg-indigo-500 text-white m-1"
                      : "bg-white text-gray-800 border m-1 border-gray-200"
                  }`}
                >
                  {!isSender && ( // Show sender name only for messages from others
                    <p className="text-xs font-semibold mb-1 text-indigo-700">
                      {msg.sender?.nombre || "Usuario Desconocido"}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {/* Display attachment info if present */}
                  {msg.messageType != "TEXT" && msg.attachmentFilename && (
                    <div className="mt-2 p-2 bg-opacity-20 bg-gray-300 rounded text-xs flex items-center">
                      <FaFileUpload className="mr-1 flex-shrink-0" />
                      <span className="truncate">{msg.attachmentFilename}</span>
                      {/* Add download link if msg.attachmentUrl exists */}
                    </div>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      isSender ? "text-indigo-100" : "text-gray-400"
                    } text-right`}
                  >
                    {formatChatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {/* Empty div to ensure scrolling to the bottom works */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-gray-200 bg-gray-50"
      >
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 border-b pb-2 border-gray-200">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}-${file.lastModified}`}
                className="flex items-center bg-indigo-100 rounded-md px-2 py-1 text-xs text-indigo-800"
              >
                <span className="max-w-[100px] truncate mr-1.5">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm leading-none"
                  aria-label="Eliminar archivo"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-2">
          {/* File Upload Button/Dropzone */}
          <div
            className={`relative flex items-center justify-center w-10 h-10 flex-shrink-0 rounded-lg border-2 border-dashed cursor-pointer transition-colors
              ${
                isDragging
                  ? "border-indigo-500 bg-indigo-100"
                  : "border-gray-300 hover:border-indigo-400"
              }
              ${fileError ? "border-red-500 bg-red-100" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Adjuntar archivo"
            title="Adjuntar archivo (PNG, JPG, PDF - Max 5MB)"
          >
            <FaFileUpload
              className={`text-lg ${
                isDragging ? "text-indigo-600" : "text-gray-500"
              }`}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".png,.jpg,.jpeg,.pdf" // Match validation
              aria-hidden="true" // Hide from accessibility tree as the div handles interaction
            />
          </div>

          {/* Text Input */}
          <textarea
            rows={1} // Start with one row
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isConnected ? "Escribe tu mensaje..." : "Esperando conexión..."
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none overflow-y-auto max-h-24 text-sm" // Added max-height and auto overflow
            aria-label="Escribir mensaje"
            disabled={!isConnected || connectionError}
            onKeyDown={(e) => {
              // Send on Enter, new line on Shift+Enter
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent default newline
                handleSubmit(e); // Trigger form submission
              }
            }}
            style={{ height: "auto", minHeight: "40px" }} // Adjust height dynamically (basic)
            onInput={(e) => {
              // Auto-resize textarea
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={
              (!message.trim() && selectedFiles.length === 0) ||
              !isConnected ||
              connectionError
            }
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Enviar mensaje"
          >
            <FaPaperPlane className="text-lg" />
          </button>
        </div>

        {/* Error Messages */}
        {fileError && <p className="mt-1 text-xs text-red-600">{fileError}</p>}
        {connectionError && (
          <p className="mt-1 text-xs text-red-600">
            Error de conexión: {connectionError}
          </p>
        )}

        {/* Helper Text (Optional) */}
        {!fileError && !connectionError && (
          <p className="mt-1 text-xs text-gray-500">
            Shift+Enter para nueva línea. Archivos: PNG, JPG, PDF (Max 5MB).
          </p>
        )}
      </form>
    </div>
  );
};
export default ChatComponent;
