import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { listUsers } from '../../../../services/UsuarioService';

export const CreateSitesComponent = ({ addSite }) => {
  // Estado para mostrar/ocultar modal
  const [showModal, setShowModal] = useState(false);

  // Estado para lista de usuarios disponibles para asignar
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);

  // Estado que contiene los datos del formulario, incluido usuariosAsignados
  const [siteData, setSiteData] = useState({
    type: 'Collaboration Site',
    name: '',
    siteId: '',
    visibility: 'Public',
    description: '',
    usuariosAsignados: [] // Array de usuarios seleccionados
  });

  // useEffect para cargar la lista de usuarios simulada al montar componente

useEffect(() => {
  const obtenerUsuarios = async () => {
    try {
      const response = await listUsers(); // Sin departamento
      if (response && response.data) {
        setUsuariosDisponibles(response.data);
      } else {
        console.warn("Respuesta inesperada del servidor", response);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  obtenerUsuarios();
}, []);

  // Función para abrir el modal
  const handleShow = () => setShowModal(true);

  // Función para cerrar el modal
  const handleClose = () => setShowModal(false);

  // Maneja los cambios en inputs normales (texto, radio, textarea)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSiteData({
      ...siteData,
      [name]: value
    });
  };

  // Maneja la selección múltiple de usuarios
  const handleUserSelection = (e) => {
    // e.target.selectedOptions es una colección de opciones seleccionadas
    const options = Array.from(e.target.selectedOptions);
    // Mapeamos las opciones seleccionadas a objetos con id y nombre
    const seleccionados = options.map((opt) => ({
      id: parseInt(opt.value), // Convertimos valor a número
      nombre: opt.text
    }));
    // Actualizamos el estado con el array de usuarios seleccionados
    setSiteData({
      ...siteData,
      usuariosAsignados: seleccionados
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mostrar en consola el objeto completo que se enviará al backend
    console.log('Datos a enviar al backend:', siteData);

    // Llamamos la función que pasa los datos al componente padre o backend
    addSite(siteData);

    // Cerramos el modal
    handleClose();

    // Reiniciamos el formulario a valores iniciales
    setSiteData({
      type: 'Collaboration Site',
      name: '',
      siteId: '',
      visibility: 'Public',
      description: '',
      usuariosAsignados: []
    });
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        type="button"
        className="list-group-item list-group-item-action create-site-btn"
        onClick={handleShow}
      >
        <i className="bi bi-plus-circle-fill me-2"></i>
        Crear Sitio
      </button>

      {/* Modal para crear nuevo sitio */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-globe me-2"></i>
            Crear Nuevo Sitio
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Container>
              {/* Tipo de sitio (solo lectura) */}
              <Row className="mb-1">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-primary">
                      <i className="bi bi-tag-fill me-2"></i>
                      Tipo de Sitio
                    </Form.Label>
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue="Sitio de Colaboración"
                      className="form-control-plaintext ps-4"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Nombre del sitio */}
              <Row className="mb-4">
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-primary">
                      <i className="bi bi-card-heading me-2"></i>
                      Nombre del Sitio <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={siteData.name}
                      onChange={handleInputChange}
                      required
                      className="border-primary"
                      placeholder="Ingrese el nombre del sitio"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* ID del sitio */}
              <Row className="mb-4">
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold text-primary">
                      <i className="bi bi-hash me-2"></i>
                      ID del Sitio <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="siteId"
                      value={siteData.siteId}
                      onChange={handleInputChange}
                      pattern="[a-zA-Z0-9]+"
                      title="Use solo números y letras"
                      required
                      className="border-primary"
                      placeholder="Ej: miSitio2023"
                    />
                    <Form.Text className="text-muted ms-4">
                      <i className="bi bi-info-circle me-1"></i>
                      Parte de la dirección del sitio (solo números y letras)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4 border-primary" />

              {/* Descripción */}
              <Row className="mb-4">
                <Col>
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-text-paragraph me-2"></i>
                    Descripción
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={siteData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="border-primary"
                      placeholder="Describa el propósito de este sitio..."
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Selección múltiple de usuarios */}
              <Row className="mb-4">
                <Col>
                  <Form.Group>
                    <Form.Label className="fw-bold text-primary">
                      <i className="bi bi-people-fill me-2"></i>
                      Asignar Usuarios
                    </Form.Label>
                    <Form.Select
                      multiple
                      className="border-primary"
                      value={siteData.usuariosAsignados.map(u => u.id.toString())} // Mantener selección actual
                      onChange={handleUserSelection} // Actualiza usuariosAsignados
                    >
                      {usuariosDisponibles.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples usuarios.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              {/* Configuración de visibilidad */}
              <Row className="mb-4">
                <Col>
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-eye-fill me-2"></i>
                    Configuración de Visibilidad
                  </h5>
                  <div className="ps-4">
                    <Form.Check
                      type="radio"
                      id="visibility-public"
                      name="visibility"
                      label={
                        <>
                          <span className="fw-bold">Público</span>
                          <div className="text-muted small ms-3">
                            Todos en tu organización pueden acceder a este sitio.
                          </div>
                        </>
                      }
                      value="Public"
                      checked={siteData.visibility === 'Public'}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      id="visibility-moderated"
                      name="visibility"
                      label={
                        <>
                          <span className="fw-bold">Moderado</span>
                          <div className="text-muted small ms-3">
                            Todos pueden encontrar este sitio y solicitar acceso.
                            El acceso es dado por los Administradores.
                          </div>
                        </>
                      }
                      value="Moderated"
                      checked={siteData.visibility === 'Moderated'}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      id="visibility-private"
                      name="visibility"
                      label={
                        <>
                          <span className="fw-bold">Privado</span>
                          <div className="text-muted small ms-3">
                            Solo personas añadidas por un Administrador pueden
                            encontrar y usar este sitio.
                          </div>
                        </>
                      }
                      value="Private"
                      checked={siteData.visibility === 'Private'}
                      onChange={handleInputChange}
                      className="mb-2"
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </Modal.Body>

          <Modal.Footer className="justify-content-center">
            <Button variant="outline-primary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Crear Sitio
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
