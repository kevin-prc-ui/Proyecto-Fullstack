import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { 
  // useDispatch, 
  useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import { setOpenSidebar } from "../../redux/slices/authSlice.js";
import clsx from "clsx";
import { 
  Container,
  Nav,
  Navbar,
  Button,
  // Offcanvas 
} from "react-bootstrap";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tickets",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completados",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "En proceso",
    link: "in-progress/in progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Pendientes",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "users",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    link: "trash",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  //Constantes que otorgan la funcion de cerrar el sidebar (funcional para el sidebar en celulares).
  // const dispatch = useDispatch();
  // const closeSidebar = () => dispatch(setOpenSidebar(false));


  const NavLink = ({ el }) => (
    <Nav.Item className="w-full mb-2">
      <Link
        to={el.link}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
          "text-decoration-none",
          path === el.link.split("/")[0] 
            ? "bg-primary text-white" 
            : "text-dark hover-bg-light"
        )}
      >
        <span className="fs-5">{el.icon}</span>
        <span className="fs-6">{el.label}</span>
      </Link>
    </Nav.Item>
  );

  return (
    <Container fluid className="h-100 p-3 shadow">
      <Navbar expand="lg" className="flex-column h-100">
        {/* Brand Section */}
        <Navbar.Brand href="/dashboard" className="mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="bg-primary p-2 rounded-circle">
              <MdOutlineAddTask className="text-white fs-4" />
            </span>

          </div>
        </Navbar.Brand>

        {/* Navigation Links */}
        <Nav className="flex-column flex-grow-1 w-100">
          {sidebarLinks.map((link) => (
            <NavLink el={link} key={link.label} />
          ))}
        </Nav>

        {/* Settings Section */}
        <div className="w-100 border-top pt-3">
          <Button
            variant="link"
            className="text-dark d-flex align-items-center gap-2 w-100">
            <MdSettings className="fs-5" />
            <span className="fs-6">Settings</span>
          </Button>
        </div>
      </Navbar>

      {/* Mobile Close Button
      <Navbar.Offcanvas
        id="offcanvasNavbar"
        placement="start"
        show={false} // Control this with your Redux state
        onHide={closeSidebar}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>TaskMse</Offcanvas.Title>
        </Offcanvas.Header>
      </Navbar.Offcanvas> */}
    </Container>
  );
};

export default Sidebar;