import { useCallback, useState, useRef } from 'react';
import { FaComments, FaPaperPlane, FaFileUpload } from 'react-icons/fa';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.some(file => !file.type.startsWith('image/'))) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...files]);
    setError('');
  }, []);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica de envío aquí
  };

  return (
    <div className="max-w-160 min-w-50 min-h-150 flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header del Chat */}
      <div className="flex items-center p-4 bg-indigo-50 border-b border-indigo-100">
        <FaComments className="text-indigo-600 mr-2 text-xl" />
        <h2 className="text-lg font-semibold text-gray-800">Chat del Ticket</h2>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="text-center text-gray-400 italic">
          Selecciona un mensaje para ver la conversación
        </div>
      </div>

      {/* Área de Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
        {/* Archivos seleccionados */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center bg-indigo-50 rounded-md px-2 py-1 text-sm"
              >
                <span className="max-w-[120px] truncate mr-2">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Eliminar archivo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Container */}
        <div className="flex gap-2">
          {/* Drag & Drop Area */}
          <div
            className={`relative flex items-center justify-center w-10 h-10 rounded-lg border-2 border-dashed cursor-pointer transition-colors
              ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
              ${error ? 'border-red-500 bg-red-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Subir archivo"
          >
            <FaFileUpload className={`text-xl ${isDragging ? 'text-indigo-600' : 'text-gray-500'}`} />
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept=".png,.jpg,.pdf"
              aria-label="Seleccionar archivos"
            />
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            aria-label="Escribir mensaje"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message && selectedFiles.length === 0}
            className="rounded p-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Enviar mensaje"
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        {/* Helper Text */}
        <p className="mt-2 text-xs text-gray-500">
          Formatos soportados: PNG, JPG, PDF (Max. 5MB por archivo)
        </p>
      </form>
    </div>
  );
};

export default ChatComponent;