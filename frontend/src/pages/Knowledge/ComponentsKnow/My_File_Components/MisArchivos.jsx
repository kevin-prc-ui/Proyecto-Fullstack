import React, { useState, useEffect } from 'react';
import Documents from './Documents';
import Categorias from './Categorias';
import Etiquetas from './Etiquetas';
import { SubMenu } from '../SubMenu/SubMenu';
import { BsFolderFill, BsFilePdf, BsImage, BsTrash, BsStar, BsStarFill } from 'react-icons/bs';

const MisArchivos = () => {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [favorites, setFavorites] = useState(() => {
    const saved = sessionStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFileUpload = (file) => {
    const newItem = {
      id: Date.now(),
      type: 'file',
      fileObject: file,
      name: file.name,
      fileType: file.type.includes('pdf') ? 'pdf' : 'image',
      size: (file.size / 1024).toFixed(2) + ' KB',
      date: new Date().toLocaleDateString(),
      parentId: currentFolder,
      isFavorite: favorites.includes(Date.now())
    };
    setItems(prev => [...prev, newItem]);
  };

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

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      return newFavorites;
    });
    
    setItems(prev => prev.map(item => 
      item.id === itemId ? {...item, isFavorite: !item.isFavorite} : item
    ));
  };

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const enterFolder = (folderId) => {
    setCurrentFolder(folderId);
  };

  const goBack = () => {
    setCurrentFolder(null);
  };

  const getFilteredItems = () => {
    const currentItems = items.filter(item => item.parentId === currentFolder);
    
    switch(currentFilter) {
      case 'favorites':
        return currentItems.filter(item => favorites.includes(item.id));
      case 'recent':
        return [...currentItems].sort((a,b) => new Date(b.date) - new Date(a.date));
      default:
        return currentItems;
    }
  };

  return (
    <>
      <div className="top-bar">
        <Documents 
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
        />
        <button className="top-button active">Mis archivos</button>
        <Categorias />
        <Etiquetas />
      </div>

      <div className="content">
        <h1>Mis Archivos {currentFolder && (
          <button className="btn btn-sm btn-outline-secondary ms-3" onClick={goBack}>
            Volver
          </button>
        )}</h1>
        
        <SubMenu 
          onFileUpload={handleFileUpload} 
          onCreateFolder={handleCreateFolder} 
        />
        
        <div className="uploaded-files-container mt-3">
          {getFilteredItems().length > 0 ? (
            getFilteredItems().map(item => (
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
                        className="file-preview-img"
                      />
                    )}
                    
                    <div>
                      <h5 className="mb-1">{item.name}</h5>
                      <div className="file-details">
                        <span>{item.type === 'file' ? item.size : 'Carpeta'}</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    {item.type === 'file' && (
                      <button 
                        className="btn btn-sm favorite-btn"
                        onClick={() => toggleFavorite(item.id)}
                        title={favorites.includes(item.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      >
                        {favorites.includes(item.id) ? <BsStarFill color="gold" /> : <BsStar />}
                      </button>
                    )}
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <BsTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">
              {currentFolder ? 
                'La carpeta está vacía. Sube archivos aquí.' : 
                currentFilter === 'favorites' 
                  ? 'No tienes documentos marcados como favoritos' 
                  : 'No hay elementos. Sube archivos o crea carpetas.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MisArchivos;