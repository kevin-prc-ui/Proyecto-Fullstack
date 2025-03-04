import React, { useState } from 'react';
import "../../styles/estilos.css";

const MyFile = () => {
  // Estado para controlar la visibilidad del dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  // Función para alternar la visibilidad del dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="container">
      {/* Barra superior con botones */}
      <div className="top-bar">
        <div className="dropdown">
          <button className="top-button" onClick={toggleDropdown}>
            DOCUMENTOS
          </button>
          {/* Dropdown menu */}
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Todos los documentos</button>
              <button className="dropdown-item">Editando actualmente</button>
              <button className="dropdown-item">Otros están editando</button>
              <button className="dropdown-item">Modificados recientemente</button>
              <button className="dropdown-item">Agregados recientemente</button>
              <button className="dropdown-item">Mis favoritos</button>
            </div>
          )}
        </div>
        <button className="top-button">Mis archivos</button>
        <button className="top-button">Categorías</button>
        <button className="top-button">Etiquetas</button>
      </div>

      {/* Contenido principal */}
      <div className="content">
        <h1>Mis Archivos</h1>
      </div>
    </div>
  );
};

export default MyFile;