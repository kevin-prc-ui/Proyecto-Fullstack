import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { FaTrash, FaStar, FaRegStar, FaExternalLinkAlt } from 'react-icons/fa';

const MySitesComponent = ({ sites, setSites, onSiteClick }) => {
  const toggleFavorite = (siteId) => {
    const updatedSites = sites.map(site =>
      site.siteId === siteId ? {...site, favorite: !site.favorite} : site
    );
    setSites(updatedSites);
  };

  const deleteSite = (siteId) => {
    if(window.confirm('¿Seguro que deseas eliminar este sitio?')) {
      const updatedSites = sites.filter(site => site.siteId !== siteId);
      setSites(updatedSites);
    }
  };

  return (
    <>
      {sites.length === 0 ? (
        <p>No tienes sitios creados.</p>
      ) : (
        <ListGroup>
          {sites.map(site => (
            <ListGroup.Item
              key={site.siteId}
              className="d-flex justify-content-between align-items-center"
            >
              <div 
                className="flex-grow-1 site-name"
                onClick={() => onSiteClick(site)}
                style={{cursor: 'pointer'}}
              >
                <strong>{site.name}</strong> <br />
                <small className="text-muted">ID: {site.siteId}</small>
              </div>
              <div>
                <Button
                  variant="link"
                  title={site.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                  onClick={() => toggleFavorite(site.siteId)}
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
                  onClick={() => deleteSite(site.siteId)}
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