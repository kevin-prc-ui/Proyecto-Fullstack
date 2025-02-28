import React from 'react';
import "../../styles/estilos.css";

const MyFile = () => {
  return (
    <div className="container">
      {/* Barra superior con botones */}
      <div className="top-bar">
        <button className="top-button">Documentos</button>
        <button className="top-button">Repositorio</button>
        <button className="top-button">Categorías</button>
        <button className="top-button">Etiquetas</button>
      </div>

      {/* Contenido principal */}
      <div className="content">
        <h1>Repositorio</h1>
      </div>
    </div>
  );
};

export default MyFile;