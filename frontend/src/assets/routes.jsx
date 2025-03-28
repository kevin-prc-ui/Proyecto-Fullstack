import { FaHome, FaFileAlt, FaFolderOpen, FaGlobe, FaTasks, FaUsers, FaDatabase, FaTools, FaTrashAlt } from "react-icons/fa";
import {  MdSupportAgent, MdTaskAlt, MdOutlinePendingActions } from "react-icons/md";
import { PiFolderSimpleUser } from "react-icons/pi";



const linkData = [
    {
      label: "Helpdesk",
      icon: <MdSupportAgent />,
      children: [
        {
          label: "Tickets",
          link: "/helpdesk/tasks",
          icon: <FaTasks />,
        },
        {
          label: "Completados",
          link: "/helpdesk/completado/completado",
          icon: <MdTaskAlt />,
        },
        {
          label: "En proceso",
          link: "/helpdesk/en-proceso/en-proceso",
          icon: <MdOutlinePendingActions />,
        },
        {
          label: "Pendientes",
          link: "/helpdesk/todo/todo",
          icon: <MdOutlinePendingActions />,
        },
        {
          label: "Equipo",
          link: "/admin/helpdesk/users",
          icon: <FaUsers />,
        },
        {
          label: "Eliminados",
          link: "/helpdesk/trash",
          icon: <FaTrashAlt />,
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
        },
        {
          label: "Mis Archivos",
          link: "/knowledge/myfile",
          icon: <FaFileAlt />,
        },
        {
          label: "Archivo Compartido",
          link: "/knowledge/sharedfile",
          icon: <FaFolderOpen />,
        },
        {
          label: "Sitios",
          link: "/knowledge/sites",
          icon: <FaGlobe />,
        },
        {
          label: "Tareas",
          link: "/knowledge/task",
          icon: <FaTasks />,
        },
        {
          label: "Personas",
          link: "/knowledge/people",
          icon: <FaUsers />,
        },
        {
          label: "Repositorio",
          link: "/knowledge/repository",
          icon: <FaDatabase />,
        },
        {
          label: "Herramientas de Administración",
          link: "/knowledge/admintools",
          icon: <FaTools />,
        },
      ]
    }
  ];
export default linkData;
