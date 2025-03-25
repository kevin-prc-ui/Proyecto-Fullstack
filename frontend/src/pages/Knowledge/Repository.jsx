import React from 'react';
import { DocumentsReposi } from "../Knowledge/ComponentsKnow/Repository_Components/DocumentsReposi";
import { RepositoryReposi } from './ComponentsKnow/Repository_Components/RepositoryReposi';
import { CategoriesReposi } from './ComponentsKnow/Repository_Components/CategoriesReposi';
import { TagsReposi } from './ComponentsKnow/Repository_Components/TagsReposi';
import { SubMenu } from './ComponentsKnow/SubMenu/SubMenu';
import "../../styles/estilos.css";


const Repository = () => {
  return (
    <div className="container">
      {/* Barra superior con botones */}
      <div className="top-bar">
        <DocumentsReposi />
        <RepositoryReposi />
        <CategoriesReposi />
        <TagsReposi />
      </div>

      {/* Contenido principal */}
      <div className="content">
        <h1>Repositorio</h1>
        <SubMenu />
      </div>
    </div>
  );
};

export default Repository;21
              