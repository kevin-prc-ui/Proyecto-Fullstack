import React, { useState, useEffect } from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';

export const SitesFinderComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allSites, setAllSites] = useState([]);

  useEffect(() => {
    const storedSites = JSON.parse(localStorage.getItem('mySites')) || [];
    setAllSites(storedSites);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = allSites.filter(site =>
      site.name.toLowerCase().includes(value.toLowerCase()) ||
      site.siteId.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="sites-search-container">
      <h5 className="text-primary fw-bold mb-3">
        <i className="bi bi-search me-2"></i>Buscar Sitios
      </h5>

      <InputGroup className="mb-3">
        <InputGroup.Text id="search-addon">
          <i className="bi bi-search" />
        </InputGroup.Text>
        <Form.Control
          placeholder="Buscar por nombre o ID del sitio..."
          value={query}
          onChange={handleSearchChange}
          autoFocus
        />
      </InputGroup>

      {results.length > 0 ? (
        <ListGroup>
          {results.map((site, index) => (
            <ListGroup.Item key={index}>
              <strong>{site.name}</strong> <br />
              <span className="site-id-text">ID: {site.siteId}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : query ? (
        <p className="text-muted">No se encontraron sitios.</p>
      ) : null}
    </div>
  );
};

export default SitesFinderComponent;
