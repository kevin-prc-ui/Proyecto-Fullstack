import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { FaFileUpload, FaImage, FaFilePdf, FaCheckCircle, FaArrowLeft, FaUserPlus, FaUser } from 'react-icons/fa';
import { listUsers } from '../../../../services/UsuarioService'; // Asegúrate que la ruta es correcta
import SitioService from '../../../../services/SitioService';

const SiteView = ({ site, onGoBack }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Estado para la lista de usuarios cargados del backend
  const [usersState, setUsersState] = useState({
    loading: false,
    error: null,
    users: []
  });

  // Carga usuarios desde backend cuando se abre el modal
  useEffect(() => {
    if (showUserModal) {
      setUsersState({ loading: true, error: null, users: [] });
      listUsers()
        .then(response => {
          setUsersState({ loading: false, error: null, users: response.data });
        })
        .catch(error => {
          setUsersState({ loading: false, error: error.message || 'Error al cargar usuarios', users: [] });
        });
    }
  }, [showUserModal]);

  // Cargar usuario logueado desde localStorage al montar componente
  useEffect(() => {
    const usuario = localStorage.getItem('usuarioLogueado');
    if (usuario) {
      setUsuarioLogueado(JSON.parse(usuario));
    }
  }, []);

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = usersState.users.filter(user =>
    `${user.nombre} ${user.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle usuario seleccionado en el modal
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const exists = prev.some(u => u.id === user.id);
      if (exists) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Cuando se confirma agregar usuarios seleccionados
  const handleAddUsers = () => {
    setShowUserModal(false);
    setSearchTerm('');
  };

  // Manejo de envío de publicación (post)
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim() || selectedFile) {
      const newPostObj = {
        id: Date.now(),
        text: newPost,
        file: selectedFile ? {
          name: selectedFile.name,
          type: selectedFile.type.includes('image') ? 'image' : 'pdf',
          rawFile: selectedFile,  // Guardamos el archivo original para mostrar imagen
        } : null,
        timestamp: new Date().toLocaleString()
      };
      setPosts(prev => [...prev, newPostObj]);
      setNewPost('');
      setSelectedFile(null);
    }
  };

  // Marcar publicación como completada, asignando el usuario logueado
const markAsCompleted = (postId) => {
  const post = posts.find(p => p.id === postId);
  if (post) {
    const activityWithUser = {
      ...post,
      user: usuarioLogueado // Aquí aseguramos que se use el usuario logueado
    };
    setActivities(prev => [...prev, activityWithUser]);
    setPosts(prev => prev.filter(p => p.id !== postId));
  }
};

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={onGoBack} className="mb-3">
        <FaArrowLeft /> Volver a mis sitios
      </Button>

      <h2 className="mb-4">{site.name} <small className="text-muted">(ID: {site.siteId})</small></h2>

      <Row className="mt-3">
        {/* Contenedor Usuarios */}
        <Col md={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Usuarios ({selectedUsers.length})</span>
              <Button variant="primary" size="sm" onClick={() => setShowUserModal(true)}>
                <FaUserPlus /> Agregar
              </Button>
            </Card.Header>
            <Card.Body>
              {selectedUsers.length === 0 ? (
                <p>No hay usuarios agregados aún.</p>
              ) : (
                <ListGroup>
                  {selectedUsers.map(user => (
                    <ListGroup.Item key={user.id}>
                      <div className="d-flex align-items-center">
                        <FaUser size={16} className="text-primary mr-2" />
                        <div>
                          <h6 className="mb-1">{user.nombre} {user.apellido}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Contenedor Publicaciones */}
        <Col md={4}>
          <Card>
            <Card.Header>Publicaciones</Card.Header>
            <Card.Body>
              <Form onSubmit={handlePostSubmit}>
                <Form.Group controlId="newPostText">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Escribe algo..."
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="fileUpload" className="mt-2">
                  <Form.Control
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setSelectedFile(e.target.files[0])}
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">
                  Publicar
                </Button>
              </Form>

              <hr />

              {posts.length === 0 ? (
                <p>No hay publicaciones.</p>
              ) : (
                posts.map(post => (
                  <Card key={post.id} className="mb-2">
                    <Card.Body>
                      <Card.Text>{post.text}</Card.Text>
                      {post.file && post.file.type === 'image' && (
                        <img
                          src={URL.createObjectURL(post.file.rawFile)}
                          alt={post.file.name}
                          style={{ maxWidth: '100%', maxHeight: 200 }}
                        />
                      )}
                      {post.file && post.file.type === 'pdf' && (
                        <div>
                          <FaFilePdf size={30} /> {post.file.name}
                        </div>
                      )}
                      <small className="text-muted">{post.timestamp}</small>
                      <Button
                        variant="success"
                        size="sm"
                        className="float-right"
                        onClick={() => markAsCompleted(post.id)}
                      >
                        <FaCheckCircle /> Revisado
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Contenedor Actividades Completadas (más grande) */}
        <Col md={4}>
          <Card style={{ minHeight: '600px', overflowY: 'auto' }}>
            <Card.Header>Actividades Completadas</Card.Header>
            <Card.Body>
              {activities.length === 0 ? (
                <p>No hay actividades completadas.</p>
              ) : (
                activities.map(activity => (
                  <Card key={activity.id} className="mb-3">
                    <Card.Body>
                      <Card.Text>{activity.text}</Card.Text>
                      {activity.file && activity.file.type === 'image' && (
                        <img
                          src={URL.createObjectURL(activity.file.rawFile)}
                          alt={activity.file.name}
                          style={{ maxWidth: '100%', maxHeight: 200 }}
                        />
                      )}
                      {activity.file && activity.file.type === 'pdf' && (
                        <div>
                          <FaFilePdf size={30} /> {activity.file.name}
                        </div>
                      )}
                      <small className="text-muted d-block mb-2">{activity.timestamp}</small>
                      <div className="d-flex align-items-center">
                        <FaUser className="text-primary mr-2" />
                        {activity.user ? (
                          <div>
                            <strong>{activity.user.nombre} {activity.user.apellido}</strong><br />
                            <small className="text-muted">{activity.user.email}</small>
                          </div>
                        ) : (
                          <small className="text-muted">Usuario desconocido</small>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar usuarios */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Agregar usuarios al sitio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </Form.Group>

          {usersState.loading && <p>Cargando usuarios...</p>}
          {usersState.error && <p className="text-danger">Error al cargar usuarios: {usersState.error}</p>}

          {!usersState.loading && !usersState.error && filteredUsers.length === 0 && (
            <p>No se encontraron usuarios.</p>
          )}

          <div className="list-group mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredUsers.map(user => {
              const isSelected = selectedUsers.some(u => u.id === user.id);
              return (
                <div
                  key={user.id}
                  className={`list-group-item list-group-item-action ${isSelected ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="d-flex align-items-center">
                    <FaUser size={20} className={isSelected ? 'text-white' : 'text-primary'} />
                    <div className="flex-grow-1 ml-3">
                      <h5 className="mb-1">{user.nombre} {user.apellido}</h5>
                      <p className="mb-1 small">{user.email}</p>
                    </div>
                    <small>ID: {user.id}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddUsers} disabled={selectedUsers.length === 0}>
            Agregar usuarios seleccionados
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SiteView;
