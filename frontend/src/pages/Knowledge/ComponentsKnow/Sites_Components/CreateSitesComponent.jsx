import React, { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';


export const CreateSitesComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [siteData, setSiteData] = useState({
    type: 'Collaboration Site',
    name: '',
    siteId: '',
    visibility: 'Public',
    description: ''
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSiteData({
      ...siteData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    console.log('Datos del sitio:', siteData);
    handleClose();
  };

  return (
    <>
      <button 
        type="button" 
        className="list-group-item list-group-item-action create-site-btn"
        onClick={handleShow}
      >
        <i className="bi bi-plus-circle-fill me-2"></i>
        Crear Sitio
      </button>

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
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" onClick={handleClose}>
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              <i className="bi bi-check-circle me-2"></i>
              Crear Sitio
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </>
  );
};

export default CreateSitesComponent;