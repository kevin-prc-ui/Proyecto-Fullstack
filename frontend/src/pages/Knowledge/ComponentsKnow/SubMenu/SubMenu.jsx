import { 
    BsCheck2Square,  // Select
    BsPlusSquare,    // Create
    BsUpload,        // Upload
    BsListCheck      // Selected items
  } from "react-icons/bs";
  
  export const SubMenu = () => {
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
        <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
          <BsUpload /> Upload
        </button>
  
        {/* Selected items */}
        <button className="btn bg-dark-subtle d-flex align-items-center gap-2">
          <BsListCheck /> Selected items
        </button>
      </div>
    );
  };
  
  export default SubMenu;