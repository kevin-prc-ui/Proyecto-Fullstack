import { useState, useEffect } from 'react';
import {
  createCarpeta,
  getAllCarpetas,
  uploadArchivo,
  getArchivoUrl
} from '../../../../services/MisArchivosService';

export const useFileManager = () => {
  const [items, setItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar favoritos en localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // ✅ Subida de archivo usando servicio
  const handleFileUpload = async (file) => {
    try {
      const response = await uploadArchivo(file, currentFolder);
      const data = response.data;

      const newItem = {
        id: data.id,
        type: 'file',
        fileObject: file,
        name: data.nombre,
        fileType: data.tipo,
        size: (file.size / 1024).toFixed(2) + ' KB',
        date: new Date(data.fechaSubida).toLocaleDateString(),
        parentId: currentFolder,
        isFavorite: false,
        url: getArchivoUrl(data.id), // URL del archivo
      };

      setItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error al subir archivo:', error);
    }
  };

  // ✅ Crear carpeta
  const handleCreateFolder = async (folderName) => {
    const carpetaDto = {
      nombre: folderName,
      carpetaPadreId: currentFolder,
    };

    try {
      const response = await createCarpeta(carpetaDto);
      const nuevaCarpeta = response.data;

      setItems(prev => [
        ...prev,
        {
          id: nuevaCarpeta.id,
          type: 'folder',
          name: nuevaCarpeta.nombre,
          date: new Date(nuevaCarpeta.fechaCreacion).toLocaleDateString(),
          parentId: nuevaCarpeta.carpetaPadreId,
        }
      ]);
    } catch (error) {
      console.error("Error al crear carpeta:", error);
    }
  };

  // ✅ Obtener carpetas al montar
  useEffect(() => {
    const fetchCarpetas = async () => {
      try {
        const response = await getAllCarpetas();
        const carpetas = response.data.map(c => ({
          id: c.id,
          type: 'folder',
          name: c.nombre,
          date: new Date(c.fechaCreacion).toLocaleDateString(),
          parentId: c.carpetaPadreId,
        }));
        setItems(carpetas);
      } catch (error) {
        console.error("Error al cargar carpetas:", error);
      }
    };

    fetchCarpetas();
  }, []);

  // ✅ Favoritos
  const toggleFavorite = (itemId) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );

    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
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

  // ✅ Filtrado
  const getFilteredItems = () => {
    const currentItems = items.filter(item =>
      currentFolder === null
        ? item.parentId == null
        : String(item.parentId) === String(currentFolder)
    );

    switch (currentFilter) {
      case 'favorites':
        return currentItems.filter(item => favorites.includes(item.id));
      case 'recent':
        return [...currentItems].sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return currentItems;
    }
  };

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
    getFilteredItems,
  };
};
