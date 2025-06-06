import React, { useState, useEffect } from 'react';
import { Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { FaTrash, FaStar, FaRegStar, FaExternalLinkAlt } from 'react-icons/fa';
import { getSitios, deleteSitio } from '../../../../services/SitioService';
import { getSitiosByUser } from '../../../../services/SitioService';
import { getUserId } from '../../../../services/UsuarioService';


const MySitesComponent = ({ onSiteClick, userId }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar sitios al montar el componente o cuando cambie el userId
useEffect(() => {
  const fetchSites = async () => {
    try {
      setLoading(true);
      setError(null);

      const userIdResponse = await getUserId();
      const userId = userIdResponse.data;

      const response = await getSitiosByUser(userId);
      setSites(response.data);
    } catch (err) {
      console.error("Error al cargar sitios:", err);
      setError("Error al cargar los sitios. Verifica tu sesión.");
    } finally {
      setLoading(false);
    }
  };

  const token = localStorage.getItem("authToken");

  if (token) {
    fetchSites();
  } else {
    console.warn("Token no disponible aún.");
  }
}, []);

  const toggleFavorite = async (siteId) => {
    try {
      // Actualización optimista
      const updatedSites = sites.map(site =>
        site.id === siteId ? {...site, favorite: !site.favorite} : site
      );
      setSites(updatedSites);
      
      // Llamada al backend para actualizar
      await updateSitio(siteId, { favorite: !sites.find(s => s.id === siteId).favorite });
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
      // Revertir cambios si hay error
      setSites(sites);
      setError("Error al actualizar favorito");
    }
  };

  const handleDeleteSite = async (siteId) => {
    if(window.confirm('¿Seguro que deseas eliminar este sitio?')) {
      try {
        await deleteSitio(siteId);
        setSites(prevSites => prevSites.filter(site => site.id !== siteId));
      } catch (err) {
        console.error("Error al eliminar sitio:", err);
        setError("Error al eliminar el sitio");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando sitios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <>
      {sites.length === 0 ? (
        <p className="mt-3">No tienes sitios creados.</p>
      ) : (
        <ListGroup className="mt-3">
          {sites.map(site => (
            <ListGroup.Item
              key={site.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div 
                className="flex-grow-1 site-name"
                onClick={() => onSiteClick(site)}
                style={{cursor: 'pointer'}}
              >
                <strong>{site.nombre}</strong> <br />
                <small className="text-muted">ID: {site.siteId}</small>
              </div>
              <div>
                <Button
                  variant="link"
                  title={site.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  onClick={() => toggleFavorite(site.id)}
                >
                  {site.favorite ? <FaStar color="#ffc107" /> : <FaRegStar />}
                </Button>
                <Button
                  variant="link"
                  title="Abrir sitio"
                  onClick={() => onSiteClick(site)}
                >
                  <FaExternalLinkAlt color="#0d6efd" />
                </Button>
                <Button
                  variant="link"
                  title="Eliminar sitio"
                  onClick={() => handleDeleteSite(site.id)}
                >
                  <FaTrash color="#dc3545" />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default MySitesComponent;