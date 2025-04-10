import React, { useEffect, useState } from 'react';
import {listUsers} from '../../services/UsuarioService';
import TaskForm from './ComponentsKnow/Task_Components/TaskForm';

const People = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]); // Estado para la lista de usuarios
  const isAuth = localStorage.getItem("authToken");

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      alert('Por favor ingresa un término de búsqueda');
      return;
    }
    alert(`Buscando: ${searchTerm}`);
    // Aquí puedes agregar la lógica de búsqueda real
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

    useEffect(() => {
      const fetchUsers = async () => {
        await getAllUsers();
      };
  
      if (isAuth) fetchUsers();
    }, [isAuth]);
  
    async function getAllUsers() {
        const response = await listUsers(); // Llama al servicio para obtener los usuarios
        setUsuarios(response.data); // Actualiza el estado con la lista de usuarios
    }


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h1 className="h4 mb-0">Personas</h1>
            </div>
            
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Buscar personas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="input-group-append">
                  <button 
                    onClick={handleSearch} 
                    className="btn btn-primary btn-lg"
                  >
                    <i className="fas fa-search mr-2"></i>Buscar
                  </button>
                </div>
              </div>
              
              {/* Espacio para resultados futuros */}
              <div className="mt-4">
                  users={usuarios}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;