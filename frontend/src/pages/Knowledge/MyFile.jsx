import React, { useState } from 'react';
import Documents from './ComponentsKnow/My_File_Components/Documents';
import MisArchivos from './ComponentsKnow/My_File_Components/MisArchivos';
import Categorias from './ComponentsKnow/My_File_Components/Categorias';
import Etiquetas from './ComponentsKnow/My_File_Components/Etiquetas';
import SubMenu from './ComponentsKnow/SubMenu/SubMenu';
import "../../styles/estilos.css";

const MyFile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Función que recibe el archivo desde SubMenu
  const handleFileUpload = (file) => {
    setUploadedFile(file);
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
        
        {/* Mostrar el archivo subido */}
        {uploadedFile && (
          <div className="uploaded-file mt-3 p-3 border rounded">
            <h5>Archivo subido:</h5>
            <p><strong>Nombre:</strong> {uploadedFile.name}</p>
            <p><strong>Tipo:</strong> {uploadedFile.type}</p>
            <p><strong>Tamaño:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
            
            {/* Vista previa para imágenes */}
            {uploadedFile.type.startsWith('image/') && (
              <div className="mt-2">
                <img 
                  src={URL.createObjectURL(uploadedFile)} 
                  alt="Vista previa" 
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
            )}
            
            {/* Ícono para PDFs */}
            {uploadedFile.type === 'application/pdf' && (
              <div className="mt-2">
                <i className="fas fa-file-pdf" style={{ fontSize: '48px', color: 'red' }}></i>
                <p>Documento PDF</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFile;