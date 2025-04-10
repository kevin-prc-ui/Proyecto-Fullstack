// c:\react\Proyecto\frontend\src\components\Sidebar\index.jsx
import { useState, useMemo } from "react";
import { MdSettings } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Container, Nav, Navbar, Button, Spinner, Alert } from "react-bootstrap"; // Added Spinner, Alert
import PropTypes from 'prop-types';

import linkData from "../../assets/routes"; // Data source for links
import { useUserRoles } from "../../hooks/useUserRoles"; // Import the custom hook
/**
 * Componente Sidebar - Barra lateral de navegación mejorada.
 * Muestra opciones de navegación filtradas por roles de usuario.
 * Incluye transiciones suaves y manejo de estado de carga/error.
 */
const Sidebar = () => {
  const { roles, isLoading, error } = useUserRoles(); // Use the custom hook
  const [expandedParent, setExpandedParent] = useState(null);
  const location = useLocation();

  // Memoize filtered link data based on user roles
  const filteredLinkData = useMemo(() => {
    if (isLoading || error) return []; // Don't filter until roles are loaded successfully

    return linkData
      .map(parent => ({
        ...parent,
        // Filter children based on roles. Show if no roles defined or user has at least one required role.
        children: parent.children?.filter(child =>
          !child.roles || child.roles.length === 0 || child.roles.some(role => roles.includes(role))
        )
      }))
      // Keep parent only if it has children after filtering OR if the parent itself is a direct link (optional)
      .filter(parent => parent.children?.length > 0 || (!parent.children && parent.link)); // Adjust if parents can be direct links

  }, [roles, isLoading, error]); // Recalculate when roles, loading, or error changes

  // Handle expand/collapse toggle
  const toggleParent = (parentLabel) => {
    setExpandedParent(prev => (prev === parentLabel ? null : parentLabel));
  };

  // Check if a link (or any child link) is active
  const isParentActive = (parent) => {
    // Check if parent link itself is active
    if (parent.link && location.pathname.startsWith(parent.link)) {
        return true;
    }
    // Check if any child link is active
    return parent.children?.some(child => location.pathname.startsWith(child.link)) ?? false;
  };

  const isChildActive = (link) => location.pathname.startsWith(link);

  // Render loading state
  if (isLoading) {
    return (
      <Container fluid className="h-100 p-3 d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  // Render error state
  if (error) {
      return (
          <Container fluid className="h-100 p-3">
              <Alert variant="danger">Error al cargar menú, inicia sesion nuevamente: {error}</Alert>
          </Container>
      );
  }

  // Render sidebar content
  return (
    <Container fluid className="h-100 p-3 bg-light border-end"> {/* Added bg-light and border */}
      <Navbar expand="lg" className=" flex-column h-100 align-items-stretch"> {/* Ensure Navbar stretches */}
        <Nav className="flex-column flex-grow-1 w-100"> {/* Use w-100 */}
          {filteredLinkData.length === 0 && !isLoading && (
             <p className="text-muted text-center mt-3">No hay opciones de menú disponibles.</p>
          )}

          {filteredLinkData.map((parent) => (
            <ParentMenuItem
              key={parent.label}
              parent={parent}
              isExpanded={expandedParent === parent.label}
              isActive={isParentActive(parent)}
              toggleParent={toggleParent}
              isChildActive={isChildActive} // Pass down for child highlighting
            />
          ))}

          {/* Separator and Settings Section */}
          <div className="w-100 border-top pt-3 mt-auto">
            <SettingsButton isActive={location.pathname.startsWith('/settings')} />
          </div>
        </Nav>
      </Navbar>
    </Container>
  );
};

// --- Sub-Components ---

const ParentMenuItem = ({ parent, isExpanded, isActive, toggleParent, isChildActive }) => (
  <div className="w-100 mb-1"> {/* Use mb-1 for spacing */}
    <Button
      variant="link" // Use link variant for custom styling
      className={clsx(
        "sidebar-parent-button ", // Custom class for styling/hover
        "w-100 d-flex gap-2 px-3 py-2 rounded align-items-center",
        "text-decoration-none mb-1 text-start text-dark", // Base text color
        isActive && "active" // Active class for highlighting
      )}
      onClick={() => toggleParent(parent.label)}
      aria-expanded={isExpanded}
      aria-controls={`submenu-${parent.label}`} // Accessibility
    >
      {parent.icon && <span className="fs-5">{parent.icon}</span>}
      <span className="fs-6 fw-medium">{parent.label}</span> {/* Slightly bolder label */}
      {/* Add dropdown indicator if it has children */}
      {parent.children && parent.children.length > 0 && (
         <span className="ms-auto"> {/* Push indicator to the right */}
            {/* Simple chevron indicator - replace with icons if preferred */}
            {isExpanded ? '⮝' : '⮟'}
         </span>
      )}
    </Button>

    {/* Conditionally render children with transitions */}
    {parent.children && parent.children.length > 0 && (
      <div
        id={`submenu-${parent.label}`} // Match aria-controls
        className={clsx("child-links", isExpanded && "child-links-expanded")}
        role="menu"
        aria-hidden={!isExpanded}
      >
        {parent.children.map((child, index) => (
          <ChildMenuItem
            key={child.label}
            child={child}
            index={index} // Keep index if needed for animation delay (though CSS handles fade-in now)
            isActive={isChildActive(child.link)}
          />
        ))}
      </div>
    )}
  </div>
);

ParentMenuItem.propTypes = {
  parent: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    link: PropTypes.string, // Parent might be a direct link
    children: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  toggleParent: PropTypes.func.isRequired,
  isChildActive: PropTypes.func.isRequired,
};

const ChildMenuItem = ({ child, index, isActive }) => (
  <Link
    to={child.link}
    className={clsx(
      "child-link", // Custom class for styling/animation
      "w-100 d-flex gap-2 px-3 py-2 rounded align-items-center mb-1", // Use mb-1
      "text-decoration-none text-dark", // Base text color
      isActive && "active" // Active class
    )}
    style={{ animationDelay: `${index * 0.03}s` }} // Subtle staggered fade-in
    role="menuitem"
  >
    {child.icon && <span className="fs-5">{child.icon}</span>}
    <span className="fs-6">{child.label}</span>
  </Link>
);

ChildMenuItem.propTypes = {
  child: PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      link: PropTypes.string.isRequired,
      roles: PropTypes.arrayOf(PropTypes.string) // Keep roles info if needed elsewhere
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
};


const SettingsButton = ({ isActive }) => (
  <Button
    variant="link"
    className={clsx(
        "settings-button", // Custom class
        "text-dark d-flex align-items-center gap-2 w-100 px-3 py-2 rounded",
        "text-decoration-none",
        isActive && "active" // Apply active style if settings page is active
        )}
    as={Link}
    to="/helpdesk/tasks" // Assuming settings route is /settings
  >
    <MdSettings className="fs-5" />
    <span className="fs-6 fw-medium">Configuración</span>
  </Button>
);

SettingsButton.propTypes = {
    isActive: PropTypes.bool.isRequired,
};


export default Sidebar;
