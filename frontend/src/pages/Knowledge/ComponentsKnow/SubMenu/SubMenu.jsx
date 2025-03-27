import { 
  BsCheck2Square,
  BsPlusSquare,
  BsUpload,
  BsListCheck,
  BsFolderPlus
} from "react-icons/bs";

import { useRef } from "react";

export const SubMenu = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Pasar el archivo al componente padre
      onFileUpload(file);
    }
  };

  return (
    <div className="d-flex align-items-center gap-3">  
      <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
        <BsCheck2Square /> Select
      </button>

      <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
        <BsFolderPlus /> Create
      </button>

      <button 
        className="btn bg-dark-subtle d-flex align-items-center gap-2"
        onClick={handleUploadClick}
      >
        <BsUpload /> Upload
      </button>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,.pdf"
      />

      <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
        <BsListCheck /> Selected items
      </button>
    </div>
  );
};

export default SubMenu;