import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const MyFileCompart = () => {
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
    <div className="myfile-dropdown-container" ref={dropdownRef}>
      <button 
        className="top-button" 
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        Documentos
        {showDropdown ? (
          <FiChevronUp className="myfile-dropdown-icon" />
        ) : (
          <FiChevronDown className="myfile-dropdown-icon" />
        )}
      </button>
      
      {showDropdown && (
        <div className="myfile-dropdown-menu">
          <button className="myfile-dropdown-item">Todos los documentos</button>
          <button className="myfile-dropdown-item">Editando actualmente</button>
          <button className="myfile-dropdown-item">Otros están editando</button>
          <button className="myfile-dropdown-item">Modificados recientemente</button>
          <button className="myfile-dropdown-item">Agregados recientemente</button>
          <button className="myfile-dropdown-item">Mis favoritos</button>
        </div>
      )}
    </div>
  );
};

// Estilos específicos con prefijo único
const styles = `
  .myfile-dropdown-container {
    position: relative;
    display: inline-block;
  }

  /* Estilos específicos para el ícono del dropdown */
  .myfile-dropdown-icon {
    transition: transform 0.3s ease;
    font-size: 0.9em;
    margin-left: 4px;
  }

  /* Estilos del menú desplegable */
  .myfile-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    width: 220px;
    z-index: 1000;
    margin-top: 5px;
  }

  /* Items del menú */
  .myfile-dropdown-item {
    display: block;
    width: 100%;
    padding: 10px 16px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 0.9em;
  }

  .myfile-dropdown-item:hover {
    background-color: #f8f8f8;
  }
`;

// Inyectar estilos solo una vez
if (!document.getElementById('myfile-dropdown-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'myfile-dropdown-styles';
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

export default MyFileCompart;