import React from 'react';
import {CategoriesCompart} from './ComponentsKnow/Shared_File_Components/CategoriesCompart';
import { MyFile } from './ComponentsKnow/Shared_File_Components/MyFile';
import { DocumentosCopart } from './ComponentsKnow/Shared_File_Components/DocumentosCopart';

import "../../styles/estilos.css";
import TagsCompart from './ComponentsKnow/Shared_File_Components/TagsCompart.JSX';


const SharedFile = () => {
  return (
    <div className="container">
      {/* Barra superior con botones */}
      <div className="top-bar">
        <MyFile />
        <DocumentosCopart />  
        <CategoriesCompart />
        <TagsCompart />
      </div>

      {/* Contenido principal */}
      <div className="content">
        <h1>Archivos Compartidos</h1>
      </div>
    </div>
  );
};

export default SharedFile;
