import React, { useState } from 'react';
import Documents from './ComponentsKnow/My_File_Components/Documents';
import MisArchivos from './ComponentsKnow/My_File_Components/MisArchivos';
import Categorias from './ComponentsKnow/My_File_Components/Categorias';
import Etiquetas from './ComponentsKnow/My_File_Components/Etiquetas';
import SubMenu from './ComponentsKnow/SubMenu/SubMenu';
import "../../styles/estilos.css";

const MyFile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Función que recibe el archivo desde SubMenu
  const handleFileUpload = (file) => {
    setUploadedFiles(prevFiles => [...prevFiles, file]);
  };

  // Función para eliminar un archivo
  const handleRemoveFile = (index) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="container">
      <div className="top-bar">
        <Documents />
        <MisArchivos />
        <Categorias />
        <Etiquetas />
      </div>

      <div className="content">
        <h1>Mis Archivos</h1>
        <SubMenu onFileUpload={handleFileUpload} />
        
        {/* Lista de archivos subidos */}
        <div className="uploaded-files-container mt-3">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="uploaded-file mb-3 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Archivo {index + 1}:</h5>
                  <p><strong>Nombre:</strong> {file.name}</p>
                  <p><strong>Tipo:</strong> {file.type}</p>
                  <p><strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveFile(index)}
                >
                  Eliminar
                </button>
              </div>
              
              {/* Vista previa para imágenes */}
              {file.type.startsWith('image/') && (
                <div className="mt-2">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Vista previa ${index}`} 
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
              
              {/* Ícono para PDFs */}
              {file.type === 'application/pdf' && (
                <div className="mt-2">
                  <i className="fas fa-file-pdf" style={{ fontSize: '48px', color: 'red' }}></i>
                  <p>Documento PDF</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFile;