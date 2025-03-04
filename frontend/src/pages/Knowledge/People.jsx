<<<<<<< Updated upstream
import React, { useState } from 'react';
import "../../styles/estilos.css";

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Función para manejar la búsqueda
  const handleSearch = () => {
    alert(`Buscando: ${searchTerm}`); // Aquí puedes agregar la lógica de búsqueda
  };

  // Función para manejar la tecla "Enter"
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Ejecuta la búsqueda al presionar "Enter"
    }
  };

  return (
    <div className="people-container">
      <h1>Personas</h1>

      {/* Barra de búsqueda mejorada */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar personas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress} // Manejador para la tecla "Enter"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>
      </div>
    </div>
  );
};

export default People;
=======
import React from 'react'
import "../../styles/estilos.css"


const People = () => {
  return (
    <div>
      <h1>
        Personas
      </h1>
    </div>
  )
}

export default People
>>>>>>> Stashed changes
