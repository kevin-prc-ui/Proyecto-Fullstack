import { 
  BsCheck2Square,  // Select
  BsPlusSquare,    // Create
  BsUpload,        // Upload
  BsListCheck      // Selected items
} from "react-icons/bs";
import { useRef } from "react";

export const SubMenu = () => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
      if (fileInputRef.current) {
          fileInputRef.current.click();
      }
  };

  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          console.log("Archivo seleccionado:", file.name);
          
          const reader = new FileReader();
          reader.onload = (event) => {
              console.log("Archivo cargado:", event.target.result);
              
              // Si es una imagen, puedes mostrarla en un <img>
              if (file.type.startsWith("image/")) {
                  console.log("Es una imagen, puedes mostrar una vista previa");
              } 
              // Si es un PDF, puedes manejarlo diferente
              else if (file.type === "application/pdf") {
                  console.log("Es un PDF, puedes mostrar un ícono o subirlo a un servidor");
              }
          };
          reader.readAsDataURL(file);
      }
  };

  return (
      <div className="d-flex align-items-center gap-3">  
          {/* Select */}
          <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
              <BsCheck2Square /> Select
          </button>

          {/* Create */}
          <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
              <BsPlusSquare /> Create
          </button>

          {/* Upload */}
          <button 
              className="btn bg-dark-subtle d-flex align-items-center gap-2"
              onClick={handleUploadClick}
          >
              <BsUpload /> Upload
          </button>

          {/* Input oculto para seleccionar archivos (ahora acepta imágenes + PDFs) */}
          <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*,.pdf"  // Imágenes y PDFs
          />

          {/* Selected items */}
          <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
              <BsListCheck /> Selected items
          </button>
      </div>
  );
};

export default SubMenu;