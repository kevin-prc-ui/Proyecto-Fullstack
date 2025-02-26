/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { Container, Nav, Navbar, Button } from "react-bootstrap";

const linkData = [
  {
    label: "Helpdesk",
    icon: <MdDashboard />,
    children: [
      {
        label: "Tickets",
        link: "helpdesk/tasks",
        icon: <FaTasks />,
      },
      {
        label: "Completados",
        link: "helpdesk/completed/completed",
        icon: <MdTaskAlt />,
      },
      {
        label: "En proceso",
        link: "helpdesk/in-progress/in progress",
        icon: <MdOutlinePendingActions />,
      },
      {
        label: "Pendientes",
        link: "helpdesk/todo/todo",
        icon: <MdOutlinePendingActions />,
      },
      {
        label: "Equipo",
        link: "helpdesk/users",
        icon: <FaUsers />,
      },
      {
        label: "Eliminados",
        link: "helpdesk/trash",
        icon: <FaTrashAlt />,
      }
    ]
  },
  {
    label: "Alfresco",
    icon: <MdDashboard />,
    children: [
      {
        label: "Y PUROS CORRIDOS TUMBADOS",
        link: "documental/INGRESA TU RUTA AQUI VIEJO",
        icon: <FaTasks />,
      }
    ]
  }
];

const Sidebar = () => {
  const [expandedParent, setExpandedParent] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, linkData.length);

  const toggleParent = (parentLabel) => {
    setExpandedParent(prev => prev === parentLabel ? null : parentLabel);
  };

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
        <Navbar.Brand href="/dashboard" className="mb-4">
          <div className="d-flex align-items-center gap-2">
            <span className="bg-primary p-2 rounded-circle">
              <MdOutlineAddTask className="text-white fs-4" />
            </span>
          </div>
        </Navbar.Brand>

        <Nav className="flex-column flex-grow-1 w-100">
          {sidebarLinks.map((parent) => (
            <div key={parent.label} className="w-full">
              {/* Parent Link */}
              <div
                className={clsx(
                  "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center mb-2",
                  "text-decoration-none cursor-pointer",
                  parent.children?.some(child => child.link.split("/")[0] === path)
                    ? "bg-primary text-white"
                    : "text-dark hover:bg-[#2564ed2d]"
                )}
                onClick={() => toggleParent(parent.label)}
              >
                <span className="fs-5">{parent.icon}</span>
                <span className="fs-6">{parent.label}</span>
              </div>

              {/* Animated Child Links */}
              {expandedParent === parent.label && (
                <div className="child-links ms-4 ps-2 border-start border-2">
                  {parent.children?.map((child, index) => (
                    <Link
                      key={child.label}
                      to={child.link}
                      className={clsx(
                        "child-link",
                        "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center mb-2",
                        "text-decoration-none hover:bg-[#2564ed2d]",
                        path === child.link.split("/")[0]
                          ? "bg-primary text-white"
                          : "text-dark"
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <span className="fs-5">{child.icon}</span>
                      <span className="fs-6">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Settings Section */}
          <div className="w-100 border-top pt-3 mt-auto">
            <Button
              variant=""
              className="text-dark d-flex align-items-center gap-2 w-100">
              <MdSettings className="fs-5" />
              <span className="fs-6">Settings</span>
            </Button>
          </div>
        </Nav>
      </Navbar>
    </Container>
  );
};

export default Sidebar;