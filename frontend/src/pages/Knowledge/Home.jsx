import React, { useEffect, useState } from "react";
import "../../styles/estilos.css";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../services/UsuarioService";
import { getSitiosByUser } from "../../services/SitioService";
import { getAllActivities } from "../../services/ActivityService";

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [misSitios, setMisSitios] = useState([]);
  const [misTareas, setMisTareas] = useState([]);
const [misWorkflows, setMisWorkflows] = useState([]);
  const [filtroSitios, setFiltroSitios] = useState("all");

  const navigate = useNavigate();

  // Obtener usuario y sus sitios
useEffect(() => {
  getUserId().then((res) => {
    const id = res.data;
    setUserId(id);

    // Cargar sitios
    getSitiosByUser(id)
      .then((response) => setMisSitios(response.data))
      .catch((error) =>
        console.error("Error al obtener sitios del usuario:", error)
      );

    // Cargar actividades y filtrar por usuario asignado
    getAllActivities()
      .then((response) => {
        const actividades = response.data;

        // Tareas asignadas al usuario actual
        const tareas = actividades.filter(
          (a) => a.type === "task" && a.usuariosAsignados?.includes(id)
        );

        // Workflows asignados al usuario actual
        const workflows = actividades.filter(
          (a) => a.type === "workflow" && a.usuariosAsignados?.includes(id)
        );

        setMisTareas(tareas);
        setMisWorkflows(workflows);
      })
      .catch((error) =>
        console.error("Error al obtener actividades del usuario:", error)
      );
  });
}, []);


  // Filtro de sitios
  const sitiosFiltrados = misSitios
    .filter((sitio) => {
      if (filtroSitios === "favorites") return sitio.favorito;
      return true;
    })
    .sort((a, b) => {
      if (filtroSitios === "recent") {
        return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      }
      return 0;
    });

  // Manejador de filtros
  const handleFilterChange = (filterName, value) => {
    if (filterName === "Sites") {
      setFiltroSitios(value);
    }
  };

  return (
    <div className="home-container">
      <h1>Inicio</h1>

      <div className="grid-layout">
        {/* Contenedor 1: Mis Sitios */}
        <div className="grid-item">
          <h2>Mis Sitios</h2>
          <div className="filter-container">
            <select
              className="filter small-filter"
              onChange={(e) => handleFilterChange("Sites", e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="favorites">Mis Favoritos</option>
              <option value="recent">Recientes</option>
            </select>
          </div>
          <p>Aquí puedes gestionar tus sitios</p>

          <div className="mt-3">
            {sitiosFiltrados.length === 0 ? (
              <p className="text-muted">No hay sitios para mostrar.</p>
            ) : (
              <ul className="list-unstyled">
                {sitiosFiltrados.map((sitio) => (
                  <li
                    key={sitio.id}
                    className="mb-2 p-2 border rounded bg-light"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/sitio", { state: { site: sitio } })}
                  >
                    <strong>{sitio.name}</strong> <br />
                    <small className="text-muted">ID: {sitio.siteId}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Contenedor 2: Mis Actividades */}
        <div className="grid-item">
          <h2>Mis Actividades</h2>
          <div className="filter-container activities-filters">
            <select
              className="filter small-filter"
              onChange={(e) =>
                handleFilterChange("Activities - Following", e.target.value)
              }
            >
              <option value="Following">Siguiendo</option>
              <option value="Myactivities">Mis actividades</option>
              <option value="elses">Actividades de otros</option>
              <option value="Everyones">Actividades de todos</option>
            </select>
            <select
              className="filter small-filter"
              onChange={(e) =>
                handleFilterChange("Activities - Comments", e.target.value)
              }
            >
              <option value="all">Todos los elementos</option>
              <option value="Comments">Comentarios</option>
              <option value="content">Contenido</option>
              <option value="memberships">Membresías</option>
            </select>
            <select
              className="filter small-filter"
              onChange={(e) =>
                handleFilterChange("Activities - Last 28 Days", e.target.value)
              }
            >
              <option value="today">Hoy</option>
              <option value="week1">Últimos 7 días</option>
              <option value="week2">Últimos 14 días</option>
              <option value="week3">Últimos 28 días</option>
            </select>
          </div>
          <p>Revisa y organiza tus flujos asignados.</p>
<ul className="list-unstyled mt-3">
  {misWorkflows.length === 0 ? (
    <p className="text-muted">No tienes flujos de trabajo asignados.</p>
  ) : (
    misWorkflows.map((wf) => (
      <li key={wf.id} className="mb-2 border rounded p-2 bg-light">
        <strong>{wf.name}</strong><br />
        <small className="text-muted">
          Aprobación requerida: {wf.approvalPercentage}%
        </small><br />
        <span className="text-dark">{wf.description}</span>
      </li>
    ))
  )}
</ul>


        </div>

        {/* Contenedor 3: Mis Tareas */}
        <div className="grid-item">
          <h2>Mis Tareas</h2>
          <div className="filter-container">
            <select
              className="filter small-filter"
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
<ul className="list-unstyled mt-3">
  {misTareas.length === 0 ? (
    <p className="text-muted">No tienes tareas asignadas.</p>
  ) : (
    misTareas.map((tarea) => (
      <li key={tarea.id} className="mb-2 border rounded p-2 bg-light">
        <strong>{tarea.name}</strong><br />
        <small className="text-muted">Prioridad: {tarea.priority}</small><br />
        <span className="text-dark">{tarea.description}</span>
      </li>
    ))
  )}
</ul>


        </div>

        {/* Contenedor 4: Mis Documentos */}
        <div className="grid-item">
          <h2>Mis Documentos</h2>
          <div className="filter-container">
            <select
              className="filter small-filter"
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
