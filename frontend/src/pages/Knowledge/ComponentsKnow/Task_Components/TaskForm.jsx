import React, { useState, useEffect } from 'react';
import { 
  FiX, FiSave, FiCheck, FiPlus, FiTrash2, FiUser, 
  FiCalendar, FiAlertTriangle, FiEye, FiPercent, 
  FiList, FiFileText, FiMail, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';
import { MdOutlineWorkOutline, MdTaskAlt } from 'react-icons/md';
import { RiFlowChart } from 'react-icons/ri';

const TaskForm = ({ onClose, onSave, users, taskToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'task',
    dueDate: '',
    priority: 'Medium',
    description: '',
    assignees: [],
    reviewers: [],
    approvalPercentage: 70,
    items: [],
    sendNotifications: true
  });

  const [currentItem, setCurrentItem] = useState('');
  const [activeSection, setActiveSection] = useState('details');
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    assignment: true,
    items: true,
    options: true
  });

  // Inicializar con datos de edición si existe
  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    }
  }, [taskToEdit]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (e, field) => {
    const selected = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const handleAddItem = () => {
    if (currentItem.trim()) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { id: Date.now(), name: currentItem }]
      }));
      setCurrentItem('');
    }
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return;
    }
    if (formData.type === 'workflow' && formData.reviewers.length === 0) {
      alert('Debe seleccionar al menos un revisor para flujos');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center">
              {formData.type === 'task' ? (
                <MdTaskAlt size={20} className="me-2" />
              ) : (
                <RiFlowChart size={20} className="me-2" />
              )}
              {taskToEdit ? 'Editar Actividad' : 'Nueva Actividad'}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Sección de Detalles Básicos */}
              <div className="mb-4">
                <div 
                  className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection('details')}
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <FiFileText className="me-2" />
                    Detalles Básicos
                  </h6>
                  {expandedSections.details ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.details && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tipo</label>
                      <select
                        className="form-select"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        disabled={!!taskToEdit}
                      >
                        <option value="task">Tarea</option>
                        <option value="workflow">Flujo de Trabajo</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Fecha Límite</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Prioridad</label>
                      <select
                        className="form-select"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="Low">Baja</option>
                        <option value="Medium">Media</option>
                        <option value="High">Alta</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Asignación */}
              <div className="mb-4">
                <div 
                  className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection('assignment')}
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <FiUser className="me-2" />
                    Asignación
                  </h6>
                  {expandedSections.assignment ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.assignment && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Asignados *</label>
                      <select
                        className="form-select"
                        multiple
                        size="4"
                        value={formData.assignees}
                        onChange={(e) => handleMultiSelect(e, 'assignees')}
                        required
                      >
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Mantén Ctrl/Cmd para seleccionar múltiples</small>
                    </div>

                    {formData.type === 'workflow' && (
                      <div className="col-md-6">
                        <label className="form-label">Revisores *</label>
                        <select
                          className="form-select"
                          multiple
                          size="4"
                          value={formData.reviewers}
                          onChange={(e) => handleMultiSelect(e, 'reviewers')}
                          required
                        >
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {formData.type === 'workflow' && (
                      <div className="col-md-6">
                        <label className="form-label">% Aprobación Requerida</label>
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="range"
                            className="form-range flex-grow-1"
                            min="50"
                            max="100"
                            step="5"
                            name="approvalPercentage"
                            value={formData.approvalPercentage}
                            onChange={handleChange}
                          />
                          <span className="badge bg-primary fs-6">
                            {formData.approvalPercentage}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sección de Items */}
              <div className="mb-4">
                <div 
                  className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection('items')}
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <FiList className="me-2" />
                    Items
                  </h6>
                  {expandedSections.items ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.items && (
                  <div>
                    <div className="border rounded p-3 mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {formData.items.length > 0 ? (
                        <ul className="list-group">
                          {formData.items.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>{item.name}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <FiTrash2 />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center text-muted py-3">
                          No hay items agregados
                        </div>
                      )}
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nuevo item"
                        value={currentItem}
                        onChange={(e) => setCurrentItem(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddItem}
                        disabled={!currentItem.trim()}
                      >
                        <FiPlus className="me-1" />
                        Agregar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Opciones */}
              <div className="mb-3">
                <div 
                  className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection('options')}
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <FiList className="me-2" />
                    Opciones
                  </h6>
                  {expandedSections.options ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {expandedSections.options && (
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="sendNotifications"
                      checked={formData.sendNotifications}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      <FiMail className="me-2" />
                      Enviar notificaciones por email
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer border-top-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <FiX className="me-1" />
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <FiSave className="me-1" />
                {taskToEdit ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;