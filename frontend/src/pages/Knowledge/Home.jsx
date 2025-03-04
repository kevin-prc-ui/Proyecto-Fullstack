import React from 'react';
import "../../styles/estilos.css";

const Home = () => {
  // Funciones para manejar los cambios en los filtros
  const handleFilterChange = (filterName, value) => {
    console.log(`Filtro ${filterName} cambiado a:`, value);
    // Aquí puedes agregar la lógica para filtrar los datos
  };

  return (
    <div className="home-container">
      <h1>Inicio</h1>

      {/* Contenedores */}
      <div className="grid-layout">
        {/* Contenedor 1: Mi Sites */}
        <div className="grid-item">
          <div className="filter-container">
            <select
              className="filter"
              onChange={(e) => handleFilterChange("Sites", e.target.value)}
            >
              <option value="all">All</option>
              <option value="favorites">My Favorites</option>
              <option value="recent">Recent</option>
            </select>
          </div>
          <h2>Mi Sites</h2>
          <p>Aquí puedes gestionar tus sitios web.</p>
        </div>

        {/* Contenedor 2: Mi Activities */}
        <div className="grid-item">
          <div className="filter-container">
            <div className="filter-group">
              <select
                className="filter"
                onChange={(e) => handleFilterChange("Activities - Following", e.target.value)}
              >
                <option value="">I'm Following</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter"
                onChange={(e) => handleFilterChange("Activities - Comments", e.target.value)}
              >
                <option value="">Comments</option>
                <option value="recent">Recent Comments</option>
                <option value="old">Old Comments</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter"
                onChange={(e) => handleFilterChange("Activities - Last 28 Days", e.target.value)}
              >
                <option value="">In the Last 28 Days</option>
                <option value="week1">Week 1</option>
                <option value="week2">Week 2</option>
              </select>
            </div>
          </div>
          <h2>Mi Activities</h2>
          <p>Revisa y organiza tus actividades recientes.</p>
        </div>

        {/* Contenedor 3: Mi Task */}
        <div className="grid-item">
          <div className="filter-container">
            <select
              className="filter"
              onChange={(e) => handleFilterChange("Tasks", e.target.value)}
            >
              <option value="">Overdue Tasks</option>
              <option value="task1">Task 1</option>
              <option value="task2">Task 2</option>
            </select>
          </div>
          <h2>Mi Task</h2>
          <p>Administra tus tareas pendientes.</p>
        </div>

        {/* Contenedor 4: My Documents */}
        <div className="grid-item">
          <div className="filter-container">
            <select
              className="filter"
              onChange={(e) => handleFilterChange("Documents", e.target.value)}
            >
              <option value="recently-modified">I've Recently Modified</option>
              <option value="editing">I'm Editing</option>
              <option value="favorites">My Favorites</option>
            </select>
          </div>
          <h2>My Documents</h2>
          <p>Accede y gestiona tus documentos.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;