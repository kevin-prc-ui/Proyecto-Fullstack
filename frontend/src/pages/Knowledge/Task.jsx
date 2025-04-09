import React, { useState, useEffect } from 'react';
import { FiPlus, FiClipboard, FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import { MdOutlineWorkOutline, MdTaskAlt } from 'react-icons/md';
import TaskList from './ComponentsKnow/Task_Components/TaskList';
import TaskForm from './ComponentsKnow/Task_Components/TaskForm';

const Task = () => {
  const [activities, setActivities] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const users = [
    { id: 1, name: 'Ana López', role: 'Diseñadora', avatar: 'AL' },
    { id: 2, name: 'Carlos Ruiz', role: 'Desarrollador', avatar: 'CR' },
    { id: 3, name: 'María García', role: 'QA', avatar: 'MG' }
  ];

  // Cargar y guardar datos
  useEffect(() => {
    const savedActivities = JSON.parse(localStorage.getItem('activities')) || [];
    setActivities(savedActivities);
  }, []);

  const saveActivities = (updatedActivities) => {
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };

  // Manejar guardado/actualización
  const handleSaveActivity = (activityData) => {
    let updatedActivities;
    
    if (editingTask) {
      updatedActivities = activities.map(activity => 
        activity.id === editingTask.id ? { ...activity, ...activityData } : activity
      );
    } else {
      updatedActivities = [...activities, {
        ...activityData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'Pendiente'
      }];
    }
    
    saveActivities(updatedActivities);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Filtrar actividades
  const filteredActivities = activities.filter(activity => {
    if (filter === 'completed') return activity.status === 'Completado';
    if (filter === 'pending') return activity.status === 'Pendiente';
    return true;
  });

  const tasks = filteredActivities.filter(a => a.type === 'task');
  const workflows = filteredActivities.filter(a => a.type === 'workflow');

  return (
    <div className="container py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0 text-primary">
            <MdOutlineWorkOutline size={24} className="me-2" />
            Gestor de Productividad
          </h1>
          <p className="text-muted mb-0">Organiza tus tareas y flujos de trabajo</p>
        </div>
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

      {isExpanded && (
        <TaskList 
          tasks={tasks}
          workflows={workflows}
          users={users}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowTaskForm(true);
          }}
          onToggleComplete={(id) => {
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

      {showTaskForm && (
        <TaskForm 
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSave={handleSaveActivity}
          users={users}
          taskToEdit={editingTask}
        />
      )}
    </div>
  );
};

export default Task;