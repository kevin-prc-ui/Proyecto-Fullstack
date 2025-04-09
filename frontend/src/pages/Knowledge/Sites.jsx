import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/estilos.css";

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
              <button type="button" className="list-group-item list-group-item-action">
                Checklist Gerencial
              </button>
              <button type="button" className="list-group-item list-group-item-action">
                My Sites
              </button>
              <button type="button" className="list-group-item list-group-item-action">
                Sites Finder
              </button>
              <button type="button" className="list-group-item list-group-item-action">
                Create Sites
              </button>
              <button type="button" className="list-group-item list-group-item-action">
                Favorites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sites;