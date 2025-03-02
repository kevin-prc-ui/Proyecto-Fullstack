import React from 'react';
import "../../styles/estilos.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Inicio</h1>

      {/* Contenedores */}
      <div className="grid-container">
        {/* Contenedor 1: Mi Sites */}
        <div className="grid-item">
          <h2>Mi Sites</h2>
          <p>Aquí puedes gestionar tus sitios web.</p>
        </div>

        {/* Contenedor 2: Mi Activities */}
        <div className="grid-item">
          <h2>Mi Activities</h2>
          <p>Revisa y organiza tus actividades recientes.</p>
        </div>

        {/* Contenedor 3: Mi Task */}
        <div className="grid-item">
          <h2>Mi Task</h2>
          <p>Administra tus tareas pendientes.</p>
        </div>

        {/* Contenedor 4: My Documents */}
        <div className="grid-item">
          <h2>My Documents</h2>
          <p>Accede y gestiona tus documentos.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;