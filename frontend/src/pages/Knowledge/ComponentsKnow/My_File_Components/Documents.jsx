import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Importamos íconos de react-icons

export const Documents = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className="top-button" 
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        Documentos 
        {/* Ícono que cambia según el estado */}
        {showDropdown ? (
          <FiChevronUp className="dropdown-icon" />
        ) : (
          <FiChevronDown className="dropdown-icon" />
        )}
      </button>
      
      <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
        <button className="dropdown-item">Todos los documentos</button>
        <button className="dropdown-item">Editando actualmente</button>
        <button className="dropdown-item">Otros están editando</button>
        <button className="dropdown-item">Modificados recientemente</button>
        <button className="dropdown-item">Agregados recientemente</button>
        <button className="dropdown-item">Mis favoritos</button>
      </div>
    </div>
  );
};

// Estilos para el ícono y dropdown (agregar a tu CSS)
const styles = `
  .dropdown-container {
    position: relative;
    display: inline-block;
  }

  .top-button {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dropdown-icon {
    transition: transform 0.3s ease;
    font-size: 0.9em;
    margin-left: 4px;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    width: 220px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 1000;
  }

  .dropdown-menu.show {
    opacity: 1;
    visibility: visible;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    padding: 10px 16px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background-color: #f8f8f8;
  }
`;

// Inyectar estilos
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default Documents;