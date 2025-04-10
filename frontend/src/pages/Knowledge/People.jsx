import React, { useEffect, useState } from 'react';
import { listUsers } from '../../services/UsuarioService';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAuth = localStorage.getItem("authToken");

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listUsers();
        setUsuarios(response.data || []);
        setFilteredUsers(response.data || []);
        console.log(usuarios);
        
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar los usuarios. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuth) {
      fetchUsers();
    } else {
      setError("Debes iniciar sesión para ver esta información");
    }
  }, [isAuth]);

  // Filtrar usuarios cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(usuarios);
    } else {
      const filtered = usuarios.filter(user =>
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, usuarios]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // La búsqueda se maneja automáticamente con el efecto
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h1 className="h4 mb-0">Gestión de Personas</h1>
            </div>
            
            <div className="card-body">
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Buscar por nombre, email o username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <div className="input-group-append">
                  <button 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaSearch className="mr-2" />
                    )}
                    Buscar
                  </button>
                </div>
              </div>
              
              {/* Mensajes de estado */}
              {loading && (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Cargando usuarios...</p>
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger">
                  {error}
                  {isAuth && (
                    <button 
                      className="btn btn-sm btn-link"
                      onClick={() => window.location.reload()}
                    >
                      Reintentar
                    </button>
                  )}
                </div>
              )}
              
              {/* Lista de usuarios */}
              <div className="mt-3">
                {!loading && !error && filteredUsers.length === 0 ? (
                  <div className="alert alert-info">
                    No se encontraron usuarios {searchTerm ? `para "${searchTerm}"` : ''}
                  </div>
                ) : (
                  <div className="list-group">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="list-group-item list-group-item-action">
                        <div className="d-flex align-items-center">
                          <div className="mr-3">
                            <FaUser size={24} className="text-primary" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="mb-1">{user.nombre +" "+user.apellido}</h5>
                            <p className="mb-1 small text-muted">{user.email}</p>
                            {/* {user.apellido && (
                              <span className="badge badge-secondary">{user.apellido}</span>
                            )} */}
                          </div>
                          <div className="text-right">
                            <small className="text-muted">ID: {user.id}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;