// c:\react\Proyecto\frontend\src\assets\routes.jsx
import { FaHome, FaFileAlt, FaFolderOpen, FaGlobe, FaTasks, FaUsers, FaDatabase, FaTools, FaTrashAlt } from "react-icons/fa";
import {  MdSupportAgent, MdTaskAlt, MdOutlinePendingActions } from "react-icons/md";
import { PiFolderSimpleUser } from "react-icons/pi";
import { MdAdminPanelSettings } from "react-icons/md";

const linkData = [
    {
      label: "Helpdesk",
      icon: <MdSupportAgent />,
      children: [
        {
          label: "Tickets",
          link: "/helpdesk/tasks",
          icon: <FaTasks />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Completados",
          link: "/helpdesk/completado/completado",
          icon: <MdTaskAlt />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "En proceso",
          link: "/helpdesk/en-proceso/en-proceso",
          icon: <MdOutlinePendingActions />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Pendientes",
          link: "/helpdesk/todo/todo",
          icon: <MdOutlinePendingActions />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Eliminados",
          link: "/helpdesk/trash",
          icon: <FaTrashAlt />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        }
      ]
    },
    {
      label: "Knowledge Base",
      icon: <PiFolderSimpleUser />,
      children: [
        {
          label: "Inicio",
          link: "/knowledge/home",
          icon: <FaHome />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Mis Archivos",
          link: "/knowledge/myfile",
          icon: <FaFileAlt />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Archivo Compartido",
          link: "/knowledge/sharedfile",
          icon: <FaFolderOpen />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Sitios",
          link: "/knowledge/sites",
          icon: <FaGlobe />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Tareas",
          link: "/knowledge/task",
          icon: <FaTasks />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Personas",
          link: "/knowledge/people",
          icon: <FaUsers />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
        {
          label: "Repositorio",
          link: "/knowledge/repository",
          icon: <FaDatabase />,
          roles: ["ROLE_ADMIN", "ROLE_USER"]
        },
      ]
    },
    {
      label: "Administración",
      icon: <MdAdminPanelSettings />,
      children: [
        {
          label: "Usuarios",
          link: "/admin/users",
          icon: <FaHome />,
          roles: ["ROLE_ADMIN"]
        },
      ]
    }
  ];
export default linkData;
