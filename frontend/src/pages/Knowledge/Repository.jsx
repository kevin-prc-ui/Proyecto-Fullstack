import React, { useState } from 'react';
import { DocumentsReposi } from "../Knowledge/ComponentsKnow/Repository_Components/DocumentsReposi";
import { RepositoryReposi } from './ComponentsKnow/Repository_Components/RepositoryReposi';
import { CategoriesReposi } from './ComponentsKnow/Repository_Components/CategoriesReposi';
import { TagsReposi } from './ComponentsKnow/Repository_Components/TagsReposi';
import SubMenu from './ComponentsKnow/SubMenu/SubMenu';
import { BsFolderFill, BsFilePdf, BsImage, BsTrash } from 'react-icons/bs';
import "../../styles/estilos.css";

const Repository = () => {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');

  // Manejar subida de archivos
  const handleFileUpload = (file) => {
    const newItem = {
      id: Date.now(),
      type: 'file',
      fileObject: file,
      name: file.name,
      fileType: file.type.includes('pdf') ? 'pdf' : 'image',
      size: (file.size / 1024).toFixed(2) + ' KB',
      date: new Date().toLocaleDateString(),
      parentId: currentFolder
    };
    setItems(prev => [...prev, newItem]);
  };

  // Crear nueva carpeta
  const handleCreateFolder = (folderName) => {
    const newFolder = {
      id: Date.now(),
      type: 'folder',
      name: folderName,
      date: new Date().toLocaleDateString(),
      parentId: currentFolder
    };
    setItems(prev => [...prev, newFolder]);
  };

  // Eliminar item
  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Entrar a una carpeta
  const enterFolder = (folderId) => {
    setCurrentFolder(folderId);
  };

  // Volver al nivel anterior
  const goBack = () => {
    setCurrentFolder(null);
  };

  // Obtener items actuales según la carpeta actual
  const getCurrentItems = () => {
    return items.filter(item => item.parentId === currentFolder);
  };

  return (
    <div className="container">
      <div className="top-bar">
        <DocumentsReposi />
        <RepositoryReposi />
        <CategoriesReposi />
        <TagsReposi />
      </div>

      <div className="content">
        <h1>Repositorio {currentFolder && (
          <button className="btn btn-sm btn-outline-secondary ms-3" onClick={goBack}>
            Volver
          </button>
        )}</h1>
        
        <SubMenu 
          onFileUpload={handleFileUpload} 
          onCreateFolder={handleCreateFolder} 
        />
        
        {/* Lista de archivos y carpetas */}
        <div className="uploaded-files-container mt-3">
          {getCurrentItems().length > 0 ? (
            getCurrentItems().map(item => (
              <div key={item.id} className="uploaded-file mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {item.type === 'folder' ? (
                      <button 
                        className="btn btn-sm me-2 p-0"
                        onClick={() => enterFolder(item.id)}
                      >
                        <BsFolderFill size={24} color="#4e73df" />
                      </button>
                    ) : item.fileType === 'pdf' ? (
                      <BsFilePdf size={24} color="#e74a3b" className="me-3" />
                    ) : (
                      <img 
                        src={URL.createObjectURL(item.fileObject)} 
                        alt="Preview" 
                        style={{ 
                          width: '40px', 
                          height: '40px',
                          objectFit: 'cover',
                          marginRight: '15px'
                        }}
                      />
                    )}
                    
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>{item.type === 'file' ? item.size : 'Carpeta'}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <BsTrash size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">
              {currentFolder ? 
                'La carpeta del repositorio está vacía' : 
                'No hay archivos en el repositorio. Sube archivos o crea carpetas.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repository;