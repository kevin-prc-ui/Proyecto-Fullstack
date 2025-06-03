import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/estilos.css";
import MySitesComponent from './ComponentsKnow/Sites_Components/MySitesComponent.jsx';
import SitesFinderComponent from './ComponentsKnow/Sites_Components/SitesFinderComponent.jsx';
import CreateSitesComponent from './ComponentsKnow/Sites_Components/CreateSitesComponent.jsx';
import FavoritesComponent from './ComponentsKnow/Sites_Components/FavoritesComponent.jsx';
import SiteView from './ComponentsKnow/Sites_Components/SiteView.jsx';

const Sites = () => {
  const [activeTab, setActiveTab] = useState('misSitios');
  const [sites, setSites] = useState([]);
  const [currentSite, setCurrentSite] = useState(null); // Nuevo estado para el sitio actual

  // Cargar sitios de localStorage al montar
  useEffect(() => {
    const storedSites = JSON.parse(localStorage.getItem('mySites')) || [];
    setSites(storedSites);
  }, []);

  // Guardar sitios en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('mySites', JSON.stringify(sites));
  }, [sites]);

  // Agregar nuevo sitio
  const addSite = (newSite) => {
    setSites([...sites, {...newSite, favorite: false}]);
    setActiveTab('misSitios');
  };

  // Función para abrir un sitio
  const openSite = (site) => {
    setCurrentSite(site);
  };

  // Función para volver a la vista principal
  const goBack = () => {
    setCurrentSite(null);
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'misSitios':
        return <MySitesComponent sites={sites} setSites={setSites} onSiteClick={openSite} />;
      case 'buscarSitios':
        return <SitesFinderComponent />;
      case 'crearSitio':
        return <CreateSitesComponent addSite={addSite} />;
      case 'favoritos':
        return <FavoritesComponent sites={sites} setSites={setSites} onSiteClick={openSite} />;
      default:
        return null;
    }
  };

  // Si hay un sitio seleccionado, mostramos la vista detallada
  if (currentSite) {
    return <SiteView site={currentSite} onGoBack={goBack} />;
  }

  // Vista normal de pestañas
  return (
    <div className="container mt-4 sites-tabs">
      {/* Botones de pestaña */}
      <div className="d-flex gap-3 mb-4 flex-wrap">
        <button
          className={`btn tab-button ${activeTab === 'misSitios' ? 'active' : ''}`}
          onClick={() => setActiveTab('misSitios')}
        >
          Mis sitios
        </button>
        <button
          className={`btn tab-button ${activeTab === 'buscarSitios' ? 'active' : ''}`}
          onClick={() => setActiveTab('buscarSitios')}
        >
          Buscar sitios
        </button>
        <button
          className={`btn tab-button ${activeTab === 'crearSitio' ? 'active' : ''}`}
          onClick={() => setActiveTab('crearSitio')}
        >
          Crear sitio
        </button>
        <button
          className={`btn tab-button ${activeTab === 'favoritos' ? 'active' : ''}`}
          onClick={() => setActiveTab('favoritos')}
        >
          Favoritos
        </button>
      </div>

      {/* Render del contenido dinámico */}
      <div className="components-container">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Sites;