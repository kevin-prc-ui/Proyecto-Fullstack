import React, { useState, useEffect } from 'react';
import { createMisArchivo, createCarpeta } from '../../../../services/MisArchivosService';


export const useFileManager = () => {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

const handleFileUpload = async (file) => {
  const archivoDto = {
    nombre: file.name,
    tipo: file.type.includes('pdf') ? 'pdf' : 'image',
    tamaño: file.size,
    fechaSubida: new Date().toISOString(),
    carpetaId: currentFolder, // Asumiendo que lo estás usando como parentId
  };

  try {
    const response = await createMisArchivo(archivoDto);

    const newItem = {
      id: response.data.id, // ID generado por la base de datos
      type: 'file',
      fileObject: file,
      name: response.data.nombre,
      fileType: response.data.tipo,
      size: (file.size / 1024).toFixed(2) + ' KB',
      date: new Date(response.data.fechaSubida).toLocaleDateString(),
      parentId: currentFolder,
      isFavorite: false
    };

    setItems(prev => [...prev, newItem]);

  } catch (error) {
    console.error('Error al guardar el archivo en el backend:', error);
  }
};

const handleCreateFolder = async (folderName) => {
  const carpetaDto = {
    nombre: folderName,
    carpetaPadreId: currentFolder
  };

  try {
    const response = await createCarpeta(carpetaDto);
    const nuevaCarpeta = response.data;

    setItems(prev => [...prev, {
      ...nuevaCarpeta,
      type: 'folder',
      name: nuevaCarpeta.nombre,
      date: new Date(nuevaCarpeta.fechaCreacion).toLocaleDateString()
    }]);
  } catch (error) {
    console.error("Error al guardar la carpeta en el backend:", error);
  }
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

  // Retornamos todo lo que queremos exponer a otros componentes
  return {
    items,
    currentFolder,
    currentFilter,
    setCurrentFilter,
    favorites,
    handleFileUpload,
    handleCreateFolder,
    toggleFavorite,
    handleRemoveItem,
    enterFolder,
    goBack,
    getFilteredItems
  };
};