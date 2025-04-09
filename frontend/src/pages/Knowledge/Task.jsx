import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/estilos.css";

const Sites = () => {
  // Estados para controlar la visibilidad de las listas
  const [showTasksList, setShowTasksList] = useState(false);

  // Función para alternar la visibilidad de la lista
  const toggleTasksList = () => {
    setShowTasksList(!showTasksList);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Tareas</h1>

      <div className="d-flex justify-content-center mb-4">
        <button 
          className={`btn ${showTasksList ? 'btn-danger' : 'btn-primary'}`}
          onClick={toggleTasksList}
        >
          {showTasksList ? 'Ocultar Lista' : 'Mostrar Lista'}
        </button>
      </div>

      {showTasksList && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="list-group">
              <button type="button" className="list-group-item list-group-item-action">
                My Task
              </button>
              <button type="button" className="list-group-item list-group-item-action">
                Workflows I've Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sites;