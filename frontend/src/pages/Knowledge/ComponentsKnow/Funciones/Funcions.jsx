import React, { useState, useEffect } from 'react';

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