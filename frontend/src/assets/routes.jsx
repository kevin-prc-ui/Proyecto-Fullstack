import { FaHome, FaFileAlt, FaFolderOpen, FaGlobe, FaTasks, FaUsers, FaDatabase, FaTools, FaTrashAlt } from "react-icons/fa";
import { MdDashboard, MdTaskAlt, MdOutlinePendingActions } from "react-icons/md";

const linkData = [
    {
      label: "Helpdesk",
      icon: <MdDashboard />,
      children: [
        {
          label: "Tickets",
          link: "/helpdesk/tasks",
          icon: <FaTasks />,
        },
        {
          label: "Completados",
          link: "/helpdesk/completed/completed",
          icon: <MdTaskAlt />,
        },
        {
          label: "En proceso",
          link: "/helpdesk/in-progress/in-progress",
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
      icon: <MdDashboard />,
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
