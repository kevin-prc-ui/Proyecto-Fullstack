// c:\react\Proyecto\frontend\src\components\Sidebar\index.jsx
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import linkData from "../../assets/routes";
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { getUserRoles } from "../../services/UsuarioService";

/**
 * Componente Sidebar - Barra lateral de navegación con menú colapsable
 * Muestra opciones de navegación filtradas por roles de usuario
 * Incluye animaciones y manejo de estado de elementos activos
 */
const Sidebar = () => {
  const isAuthenticated = localStorage.getItem("authToken");
  const [expandedParent, setExpandedParent] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const [state, setState] = useState({
      isLoading: true,
      roles: [],
      error: null
    });
    const accessToken = localStorage.getItem("authToken");
    const decoded = jwtDecode(accessToken).sub;
    useEffect(() => {
      let isMounted = true;
      const fetchAuthData = async () => {
        try {
          if (!isAuthenticated) {
            return isMounted && setState(s => ({ ...s, isLoading: false }));
          }
          const roles = (await getUserRoles(decoded)).data;
          if (isMounted) {
            setState({ isLoading: false, roles, error: null });
          }
        } catch (error) {
          if (isMounted) {
            setState({ isLoading: false, roles: [], error: error.message });
            console.error("Error fetching user roles:", error);
          }
        }
      };
      fetchAuthData();
      return () => { isMounted = false; };
    }, [isAuthenticated]);

    const hasRequiredRole = linkData.map(parent => ({
      ...parent,
      children: parent.children?.filter(child => 
        !child.roles || child.roles.some(role => state.roles.includes(role))
      )
      }))
      .filter(parent => parent.children?.length > 0);
  
  // // Efecto para decodificar el token JWT y obtener roles
  // useEffect(() => {
  //   const fetchUserRoles = () => {
  //     try {
  //       const accessToken = localStorage.getItem("authToken");
  //       if (!accessToken) return;
        
  //       const decoded = jwtDecode(accessToken);
  //       setUserRoles(decoded.roles || []);
  //     } catch (error) {
  //       console.error("Error decodificando token:", error);
  //       setUserRoles([]);
  //     }
  //   };
    
  //   fetchUserRoles();
  // }, []);

  // // Memoización de enlaces filtrados por roles
  // const filteredLinkData = useMemo(() => 
  //   linkData
  //     .map(parent => ({
  //       ...parent,
  //       children: parent.children?.filter(child => 
  //         !child.roles || child.roles.some(role => userRoles.includes(role))
  //       )
  //       }))
  //     .filter(parent => parent.children?.length > 0),
  //   [userRoles]
  // );

  // Manejo de expansión/colapso de menús padres
  const toggleParent = (parentLabel) => {
    setExpandedParent(prev => prev === parentLabel ? null : parentLabel);
  };

  // Verificación de enlace activo
  const isActiveLink = (link) => location.pathname.startsWith(link);

  return (
    <Container fluid className="h-100 p-3">
      <Navbar expand="lg" className="flex-column h-100">
        <Nav className="flex-column flex-grow-1 w-full">
          {hasRequiredRole.map((parent) => (
            <ParentMenuItem
              key={parent.label}
              parent={parent}
              expandedParent={expandedParent}
              toggleParent={toggleParent}
              isActiveLink={isActiveLink}
              location={location}
            />
          ))}

          {/* Sección de Configuración */}
          <div className="w-100 border-top pt-3 mt-auto">
            <SettingsButton />
          </div>
        </Nav>
      </Navbar>
    </Container>
  );
};

// Componente para ítems de menú padre
const ParentMenuItem = ({ parent, expandedParent, toggleParent, isActiveLink, location }) => (
  <div className="w-full">
    <Button
      variant="link"
      className={clsx(
        "w-full d-flex gap-2 px-3 py-2 rounded items-center mb-2",
        "text-decoration-none text-start",
        parent.children?.some(child => location.pathname.includes(child.link))
          ? "bg-primary text-white"
          : "text-dark hover:bg-[#2564ed2d]"
      )}
      onClick={() => toggleParent(parent.label)}
      aria-expanded={expandedParent === parent.label}
    >
      <span className="fs-5">{parent.icon}</span>
      <span className="fs-6">{parent.label}</span>
    </Button>

    {expandedParent === parent.label && (
      <div className="child-links ms-4 ps-2 border-start" role="menu">
        {parent.children?.map((child, index) => (
          <ChildMenuItem
            key={child.label}
            child={child}
            index={index}
            isActiveLink={isActiveLink}
          />
        ))}
      </div>
    )}
  </div>
);

// Componente para ítems de menú hijos
const ChildMenuItem = ({ child, index, isActiveLink }) => (
  <Link
    to={child.link}
    className={clsx(
      "child-link",
      "w-full lg-w-90 d-flex gap-2 px-3 py-2 rounded items-center mb-2",
      "text-decoration-none hover-bg-[#2564ed2d]",
      isActiveLink(child.link) ? "bg-primary text-white" : "text-dark"
    )}
    style={{ animationDelay: `${index * 0.05}s` }}
    role="menuitem"
  >
    <span className="fs-5">{child.icon}</span>
    <span className="fs-6">{child.label}</span>
  </Link>
);

// Componente para botón de configuración
const SettingsButton = () => (
  <Button
    variant="link"
    className="text-dark d-flex align-items-center gap-2 w-100"
    as={Link}
    to="/settings"
  >
    <MdSettings className="fs-5" />
    <span className="fs-6">Configuración</span>
  </Button>
);

// Propiedades esperadas
ParentMenuItem.propTypes = {
  parent: PropTypes.object.isRequired,
  expandedParent: PropTypes.string,
  toggleParent: PropTypes.func.isRequired,
  isActiveLink: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
};

ChildMenuItem.propTypes = {
  child: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isActiveLink: PropTypes.func.isRequired
};

export default Sidebar;