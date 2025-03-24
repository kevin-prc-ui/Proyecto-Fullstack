
import React, { useState } from 'react';

export const Documents = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="dropdown">
      <button className="top-button" onClick={toggleDropdown}>
        DOCUMENTOS
      </button>
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
  );
};

export default Documents;