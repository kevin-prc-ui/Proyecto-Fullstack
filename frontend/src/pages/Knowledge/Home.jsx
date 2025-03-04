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
        {/* Contenedor 1: Mis Sitios */}
        <div className="grid-item">
          <h2>Mis Sitios</h2>
          <div className="filter-container">
            <select
              className="filter"
              onChange={(e) => handleFilterChange("Sites", e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="favorites">Mis Favoritos</option>
              <option value="recent">Recientes</option>
            </select>
          </div>
          <p>Aquí puedes gestionar tus sitios web.</p>
        </div>

        {/* Contenedor 2: Mis Actividades */}
        <div className="grid-item">
          <h2>Mis Actividades</h2>
          <div className="filter-container activities-filters">
            <select
              className="filter small-filter"
              onChange={(e) => handleFilterChange("Activities - Following", e.target.value)}
            >
              <option value="Following">Siguiendo</option>
              <option value="Myactivities">Mis actividades</option>
              <option value="elses">Actividades de otros</option>
              <option value="Everyones">Actividades de todos</option>
            </select>
            <select
              className="filter small-filter"
              onChange={(e) => handleFilterChange("Activities - Comments", e.target.value)}
            >
              <option value="all">Todos los elementos</option>
              <option value="Comments">Comentarios</option>
              <option value="content">Contenido</option>
              <option value="memberships">Membresías</option>
            </select>
            <select
              className="filter small-filter"
              onChange={(e) => handleFilterChange("Activities - Last 28 Days", e.target.value)}
            >
              <option value="today">Hoy</option>
              <option value="week1">Últimos 7 días</option>
              <option value="week2">Últimos 14 días</option>
              <option value="week3">Últimos 28 días</option>
            </select>
          </div>
          <p>Revisa y organiza tus actividades recientes.</p>
        </div>

        {/* Contenedor 3: Mis Tareas */}
        <div className="grid-item">
          <h2>Mis Tareas</h2>
          <div className="filter-container">
            <select
              className="filter"
              onChange={(e) => handleFilterChange("Tasks", e.target.value)}
            >
              <option value="Active">Tareas Activas</option>
              <option value="Completed">Tareas Completadas</option>
              <option value="High">Tareas de Alta Prioridad</option>
              <option value="TasksToday">Tareas para Hoy</option>
              <option value="TasksAssigned">Tareas Asignadas a Mí</option>
              <option value="Unassigned">Tareas sin Asignar (Tareas en Grupo)</option>
              <option value="Overdue">Tareas Vencidas</option>
            </select>
          </div>
          <p>Administra tus tareas pendientes.</p>
        </div>

        {/* Contenedor 4: Mis Documentos */}
        <div className="grid-item">
          <h2>Mis Documentos</h2>
          <div className="filter-container">
            <select
              className="filter"
              onChange={(e) => handleFilterChange("Documents", e.target.value)}
            >
              <option value="recently-modified">Modificados Recientemente</option>
              <option value="editing">Editando Actualmente</option>
              <option value="favorites">Mis Favoritos</option>
            </select>
          </div>
          <p>Accede y gestiona tus documentos.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
