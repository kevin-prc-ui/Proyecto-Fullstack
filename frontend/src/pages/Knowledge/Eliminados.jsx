import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Spinner } from "react-bootstrap";
import { getSitiosEliminados, restaurarSitio } from "../../services/SitioService";
import { getDeletedActivities, restoreActivity } from "../../services/ActivityService";

const Eliminados = () => {
  const [sitios, setSitios] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sitiosRes, actividadesRes] = await Promise.all([
        getSitiosEliminados(),
        getDeletedActivities()
      ]);
      setSitios(sitiosRes.data);
      setActividades(actividadesRes.data);
    } catch (error) {
      console.error("Error al cargar datos eliminados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreSitio = async (id) => {
    try {
      await restaurarSitio(id);
      fetchData();
    } catch (err) {
      console.error("Error al restaurar sitio:", err);
    }
  };

  const handleRestoreActividad = async (id) => {
    try {
      await restoreActivity(id);
      fetchData();
    } catch (err) {
      console.error("Error al restaurar actividad:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Cargando datos eliminados...</p>
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5">🗂️ Sitios Eliminados</Card.Header>
            <ListGroup variant="flush">
              {sitios.length > 0 ? sitios.map((sitio) => (
                <ListGroup.Item key={sitio.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{sitio.name}</strong>
                    <div className="text-muted small">{sitio.description}</div>
                  </div>
                  <Button size="sm" variant="success" onClick={() => handleRestoreSitio(sitio.id)}>
                    Restaurar
                  </Button>
                </ListGroup.Item>
              )) : (
                <ListGroup.Item>No hay sitios eliminados.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Header as="h5">📋 Actividades Eliminadas</Card.Header>
            <ListGroup variant="flush">
              {actividades.length > 0 ? actividades.map((act) => (
                <ListGroup.Item key={act.id} className="d-flex justify-content-between align-items-center">
                  <strong>{act.name}</strong>
                  <Button size="sm" variant="success" onClick={() => handleRestoreActividad(act.id)}>
                    Restaurar
                  </Button>
                </ListGroup.Item>
              )) : (
                <ListGroup.Item>No hay actividades eliminadas.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Eliminados;
