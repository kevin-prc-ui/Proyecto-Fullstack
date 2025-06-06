import { useState, useEffect } from 'react';
import {
  createCarpeta,
  getAllCarpetas,
  uploadArchivo,
  getArchivoUrl,
  getArchivosPorCarpeta,
  getArchivosSinCarpeta
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
      console.log(data);
      

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
  const fetchData = async () => {
    try {
      // Traer carpetas
      const carpetasResponse = await getAllCarpetas();
      const carpetas = carpetasResponse.data.map(c => ({
        id: c.id,
        type: 'folder',
        name: c.nombre,
        date: new Date(c.fechaCreacion).toLocaleDateString(),
        parentId: c.carpetaPadreId,
      }));

      // Traer archivos según el estado
      let archivos = [];
      if (currentFolder !== null) {
        const archivosResponse = await getArchivosPorCarpeta(currentFolder);
        archivos = archivosResponse.data.map(a => ({
          id: a.id,
          type: 'file',
          name: a.nombre,
          fileType: a.tipo,
          size: (a.tamaño / 1024).toFixed(2) + ' KB',
          date: new Date(a.fechaSubida).toLocaleDateString(),
          parentId: a.carpetaId,
          isFavorite: favorites.includes(a.id),
          url: getArchivoUrl(a.id),
        }));
      } else {
        // Fuera de carpetas → traer archivos sin carpeta
        const archivosSinCarpetaResponse = await getArchivosSinCarpeta();
        archivos = archivosSinCarpetaResponse.data
          .filter(a => a.carpetaId === null)
          .map(a => ({
            id: a.id,
            type: 'file',
            name: a.nombre,
            fileType: a.tipo,
            size: (a.tamaño / 1024).toFixed(2) + ' KB',
            date: new Date(a.fechaSubida).toLocaleDateString(),
            parentId: null,
            isFavorite: favorites.includes(a.id),
            url: getArchivoUrl(a.id),
          }));
      }

      // Filtrar carpetas hijas si estás dentro de una carpeta
      const carpetasFiltradas = currentFolder === null
        ? carpetas.filter(c => c.parentId === null)
        : carpetas.filter(c => c.parentId === currentFolder);

      setItems([...carpetasFiltradas, ...archivos]);
    } catch (error) {
      console.error("Error al cargar carpetas o archivos:", error);
    }
  };

  fetchData();
}, [currentFolder]);



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
