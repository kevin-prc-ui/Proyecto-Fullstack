import React, { useState, useEffect } from 'react';
import { FiPlus, FiClipboard, FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import { MdOutlineWorkOutline, MdTaskAlt } from 'react-icons/md';
import TaskList from './ComponentsKnow/Task_Components/TaskList';
import TaskForm from './ComponentsKnow/Task_Components/TaskForm';
import {listUsers} from '../../services/UsuarioService';
import { getAllActivities } from '../../services/ActivityService';

const Task = () => {
  // Estados para manejar actividades, formulario, filtros y usuarios
  const [activities, setActivities] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios para asignación de tareas

  const isAuth = localStorage.getItem("authToken"); // Verifica si hay token de autenticación
// Efecto para cargar usuarios si el usuario está autenticado
      useEffect(() => {
        const fetchActivities = async () => {
          await listActivities();
          console.log(activities);
        };
    
        if (isAuth) fetchActivities();
      }, [isAuth]);

  async function listActivities() {
        const response = await getAllActivities();
        setActivities(response.data);
    }

  // Efecto para cargar usuarios si el usuario está autenticado
  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers();
    };

    if (isAuth) fetchUsers();
  }, [isAuth]);

  // Obtiene todos los usuarios desde el servicio
  async function getAllUsers() {
      const response = await listUsers();
      setUsuarios(response.data);
  }

  // Efecto para cargar actividades guardadas en localStorage al iniciar
  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
    setActivities(savedActivities);
  }, []);

  // Guarda las actividades actualizadas en estado y localStorage
  const saveActivities = (updatedActivities) => {
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };

  // Maneja la creación o edición de una actividad
  const handleSaveActivity = (activityData) => {
    let updatedActivities;
    
    if (editingTask) {
      // Si estamos editando, actualizamos la actividad existente
      updatedActivities = activities.map(activity => 
        activity.id === editingTask.id ? { ...activity, ...activityData } : activity
      );
    } else {
      // Si es una nueva, la agregamos con un id único y estado inicial
      updatedActivities = [...activities, {
        ...activityData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'Pendiente'
      }];
    }
    
    saveActivities(updatedActivities);
    setShowTaskForm(false);  // Cierra el formulario después de guardar
    setEditingTask(null);     // Limpia el estado de la tarea en edición
  };
  
  // Filtra las actividades según el estado seleccionado (todas, pendientes o completadas)
  const filteredActivities = activities.filter(activity => {
    if (filter === 'completed') return activity.status === 'Completado';
    if (filter === 'pending') return activity.status === 'Pendiente';
    return true;
  });

  // Separa las actividades por tipo: tareas y flujos de trabajo
  const tasks = filteredActivities.filter(a => a.type === 'task');
  const workflows = filteredActivities.filter(a => a.type === 'workflow');

  return (
    <div className="container py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        {/* Título y descripción */}
        <div>
          <h1 className="h3 mb-0 text-primary">
            <MdOutlineWorkOutline size={24} className="me-2" />
            Gestor de Productividad
          </h1>
          <p className="text-muted mb-0">Organiza tus tareas y flujos de trabajo</p>
        </div>

        {/* Botones para crear tarea y filtrar */}
        <div>
          <button 
            className="btn btn-primary me-2"
            onClick={() => {
              setShowTaskForm(true);
              setEditingTask(null);
            }}
          >
            <FiPlus className="me-1" />
            Crear Nueva
          </button>

          {/* Filtros por estado */}
          <div className="btn-group">
            <button 
              className={`btn btn-outline-secondary ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button 
              className={`btn btn-outline-secondary ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pendientes
            </button>
            <button 
              className={`btn btn-outline-secondary ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completadas
            </button>
          </div>
        </div>
      </header>

      {/* Lista de tareas y flujos, solo si está expandido */}
      {isExpanded && (
        <TaskList 
          tasks={tasks}
          workflows={workflows}
          users={usuarios}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }}
          onToggleComplete={(id) => {
            // Cambia el estado de completado/pendiente de la actividad
            const updatedActivities = activities.map(activity => 
              activity.id === id ? { 
                ...activity, 
                status: activity.status === 'Completado' ? 'Pendiente' : 'Completado',
                completedAt: activity.status === 'Completado' ? null : new Date().toISOString()
              } : activity
            );
            saveActivities(updatedActivities);
          }}
        />
      )}

      {/* Formulario para crear o editar tareas */}
      {showTaskForm && (
        <TaskForm 
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSave={handleSaveActivity}
          users={usuarios}
          taskToEdit={editingTask}
        />
      )}
    </div>
  );
};

export default Task;
