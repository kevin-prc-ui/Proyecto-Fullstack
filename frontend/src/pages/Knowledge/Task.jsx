import React, { useState } from 'react';
import "../../styles/estilos.css";

const Sites = () => {
  // Estados para controlar la visibilidad de las listas
  const [showSitesList, setShowSitesList] = useState(false);
  const [showTasksList, setShowTasksList] = useState(false);

  // Funciones para alternar la visibilidad de las listas
  const toggleSitesList = () => {
    setShowSitesList(!showSitesList);
  };

  const toggleTasksList = () => {
    setShowTasksList(!showTasksList);
  };

  return (
    <div className="sites-container">
      <h1>Tareas</h1>

      {/* Botón para mostrar/ocultar la lista de Tareas */}
      <button className="toggle-button" onClick={toggleTasksList}>
        {showTasksList ? 'Ocultar Lista' : 'Mostrar Lista'}
      </button>

      {/* Lista desplegable de Tareas */}
      {showTasksList && (
        <ul className="sites-list">
          <li>My Task</li>
          <li>Workflows I've Started</li>
        </ul>
      )}
    </div>
  );
};

export default Sites;
