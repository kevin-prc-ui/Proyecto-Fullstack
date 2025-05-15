import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/estilos.css";
import CheckGerenComponents from './ComponentsKnow/Sites_Components/CheckGerenComponents.jsx';
import MySitesComponent from './ComponentsKnow/Sites_Components/MySitesComponent.jsx';
import SitesFinderComponent from './ComponentsKnow/Sites_Components/SitesFinderComponent.jsx';
import CreateSitesComponent from './ComponentsKnow/Sites_Components/CreateSitesComponent.jsx';
import FavoritesComponent from './ComponentsKnow/Sites_Components/FavoritesComponent.jsx';

const Sites = () => {
  const [showList, setShowList] = useState(false);

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Sitios</h1>

      <div className="d-flex justify-content-center mb-4">
        <button 
          className={`btn ${showList ? 'btn-danger' : 'btn-primary'}`}
          onClick={toggleList}
        >
          {showList ? 'Ocultar Lista' : 'Mostrar Lista'}
        </button>
      </div>

      {showList && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="list-group">
              <CheckGerenComponents />
              <MySitesComponent />
              <SitesFinderComponent />
              <CreateSitesComponent />
              <FavoritesComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sites;