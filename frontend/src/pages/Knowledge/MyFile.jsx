import React, { useState } from 'react';
import Documents from './ComponentsKnow/My_File_Components/Documents';
import MisArchivos from './ComponentsKnow/My_File_Components/MisArchivos';
import Categorias from './ComponentsKnow/My_File_Components/Categorias';
import Etiquetas from './ComponentsKnow/My_File_Components/Etiquetas';
import SubMenu from './ComponentsKnow/My_File_Components/SubMenu';
import "../../styles/estilos.css";

const MyFile = () => {
  // Estado para controlar la visibilidad del dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  // Función para alternar la visibilidad del dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="container">
      {/* Barra superior con botones */}
      <div className="top-bar">
        <Documents />
        <MisArchivos />
        <Categorias />
        <Etiquetas />
      </div>

      {/* Contenido principal */}
      <div className="content">
        <h1>Mis Archivos</h1>
        <SubMenu />
      </div>
    </div>
  );
};

export default MyFile;