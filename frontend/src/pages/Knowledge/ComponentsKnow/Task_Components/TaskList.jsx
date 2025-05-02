// c:\react\Proyecto\frontend\src\components\TaskList.js
import React from 'react';
import { 
  FiCheck, FiEdit2, FiTrash2, FiClock, FiUser, 
  FiAlertCircle, FiAlertTriangle, FiCheckCircle 
} from 'react-icons/fi';
import { MdOutlineWorkOutline, MdTaskAlt } from 'react-icons/md';
import { RiFlowChart } from 'react-icons/ri';

const TaskList = ({ tasks, workflows, users, onEditTask, onToggleComplete, onDeleteTask }) => {
  const getAssignedUsers = (ids) => {
    return users.filter(user => ids.includes(user.id));
  };

  return (
    <div className="row g-4">

      {/* Sección de Tareas */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <MdTaskAlt size={20} className="text-primary me-2" />
              <span className="fw-semibold">Tareas</span>
              <span className="badge bg-primary ms-2">{tasks.length}</span>
            </h5>
          </div>

          <div className="card-body p-0">
            {tasks.length > 0 ? (
              <div className="list-group list-group-flush">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`list-group-item list-group-item-action p-3 hover-shadow ${task.status === 'Completado' ? 'bg-light' : ''}`}
                    onClick={() => onEditTask(task)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <button 
                          className={`btn btn-sm me-2 ${task.status === 'Completado' ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                          }}
                        >
                          <FiCheck size={14} />
                        </button>
                        <h6 className="mb-0">
                          {task.priority === 'High' ? (
                            <FiAlertTriangle className="text-danger me-2" />
                          ) : task.priority === 'Medium' ? (
                            <FiAlertCircle className="text-warning me-2" />
                          ) : (
                            <FiCheckCircle className="text-success me-2" />
                          )}
                          {task.name}
                        </h6>
                      </div>

                      <div>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTask(task);
                          }}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('¿Eliminar esta actividad?')) {
                              onDeleteTask(task.id);
                            }
                          }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-2">
                      <small className="text-muted d-flex align-items-center">
                        <FiUser className="me-1" />
                        {getAssignedUsers(task.assignees).length > 0 
                          ? getAssignedUsers(task.assignees).map(u => u.avatar).join(', ') 
                          : 'Sin asignados'}
                      </small>

                      {task.dueDate && (
                        <small className="text-muted d-flex align-items-center">
                          <FiClock className="me-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </small>
                      )}

                      {task.status === 'Completado' && task.completedAt && (
                        <small className="text-success d-flex align-items-center">
                          <FiCheck className="me-1" />
                          {new Date(task.completedAt).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5 text-muted bg-light">
                <MdTaskAlt size={48} className="mb-3 text-primary opacity-25" />
                <h5 className="mb-2">No hay tareas</h5>
                <p className="mb-0">Crea tu primera tarea haciendo clic en el botón "Crear Nueva"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sección de Flujos */}
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex align-items-center">
              <RiFlowChart size={20} className="text-info me-2" />
              <span className="fw-semibold">Flujos de Trabajo</span>
              <span className="badge bg-info ms-2">{workflows.length}</span>
            </h5>
          </div>

          <div className="card-body p-0">
            {workflows.length > 0 ? (
              <div className="list-group list-group-flush">
                {workflows.map(workflow => (
                  <div 
                    key={workflow.id} 
                    className={`list-group-item list-group-item-action p-3 hover-shadow ${workflow.status === 'Completado' ? 'bg-light' : ''}`}
                    onClick={() => onEditTask(workflow)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <button 
                          className={`btn btn-sm me-2 ${workflow.status === 'Completado' ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(workflow.id);
                          }}
                        >
                          <FiCheck size={14} />
                        </button>
                        <h6 className="mb-0">
                          <RiFlowChart className="text-info me-2" />
                          {workflow.name}
                        </h6>
                      </div>

                      <div>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditTask(workflow);
                          }}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('¿Eliminar esta actividad?')) {
                              onDeleteTask(workflow.id);
                            }
                          }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-3 mt-2">
                      <small className="text-muted d-flex align-items-center">
                        <FiUser className="me-1" />
                        {getAssignedUsers(workflow.assignees).length > 0 
                          ? getAssignedUsers(workflow.assignees).map(u => u.avatar).join(', ') 
                          : 'Sin asignados'}
                      </small>

                      <small className="text-muted d-flex align-items-center">
                        <FiUser className="me-1" />
                        {workflow.reviewers.length} revisores
                      </small>

                      <small className="text-muted d-flex align-items-center">
                        <FiCheck className="me-1" />
                        {workflow.approvalPercentage}% aprobación
                      </small>

                      {workflow.status === 'Completado' && workflow.completedAt && (
                        <small className="text-success d-flex align-items-center">
                          <FiCheck className="me-1" />
                          {new Date(workflow.completedAt).toLocaleDateString()}
                        </small>
                      )}
                    </div>

                    {workflow.items?.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">Items:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {workflow.items.slice(0, 3).map((item, index) => (
                            <span key={index} className="badge bg-light text-dark">
                              {item.name}
                            </span>
                          ))}
                          {workflow.items.length > 3 && (
                            <span className="badge bg-light text-dark">
                              +{workflow.items.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5 text-muted bg-light">
                <RiFlowChart size={48} className="mb-3 text-info opacity-25" />
                <h5 className="mb-2">No hay flujos de trabajo</h5>
                <p className="mb-0">Crea tu primer flujo haciendo clic en el botón "Crear Nueva"</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskList;
