<<<<<<< Updated upstream
import React, { useState } from 'react';
import "../../styles/estilos.css";

const Sites = () => {
  // Estado para controlar si la lista está visible
  const [showList, setShowList] = useState(false);

  // Función para alternar la visibilidad de la lista
  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <div className="sites-container">
      <h1>Sitios</h1>

      {/* Botón para mostrar/ocultar la lista */}
      <button className="toggle-button" onClick={toggleList}>
        {showList ? 'Ocultar Lista' : 'Mostrar Lista'}
      </button>

      {/* Lista desplegable */}
      {showList && (
        <ul className="sites-list">
          <li>Checklist Gerencial</li>
          <li>My Sites</li>
          <li>Sites Finder</li>
          <li>Create Sites</li>
          <li>Favorites</li>
        </ul>
      )}
    </div>
  );
};

export default Sites;
=======
import React from 'react'
import "../../styles/estilos.css"


const Sites = () => {
  return (
    <div>
      <h1>
        Sitios
      </h1>
    </div>
  )
}

export default Sites
>>>>>>> Stashed changes
