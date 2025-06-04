import "../styles/index.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { TbBulb } from "react-icons/tb";
import { LiaUserAstronautSolid } from "react-icons/lia";
import { Button, Transition } from "@headlessui/react";
import { FaRegHandPeace, FaUserPlus, FaSignInAlt, FaSync } from "react-icons/fa";
import { Link} from "react-router-dom";
import { UseLoginHandler } from "../components/MicrosoftAuth/ButtonHandler";
import { useEffect, useState } from "react";
import CreateTicket from "../components/Ticket/CreateTicket";
import React from "react";
import { getUserId } from "../services/UsuarioService";
import { listTicketsByUser } from "../services/TicketService";

const Dashboard = () => {
  return (
    <>
      <div className="App">
        <AuthenticatedTemplate>
          <ProfileContent />
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <AuthPrompt />
        </UnauthenticatedTemplate>
      </div>
    </>
  );
};
const AuthPrompt = () => {
  const { handleLogin } = UseLoginHandler();
  return (
    <>
      <Transition
        as="div"
        appear
        show
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden space-y-4 p-2"
      >
        <div className="flex items-center space-x-2 text-primary-600">
          <FaRegHandPeace className="w-6 h-6 flex-shrink-0" />
          <h2 className="text-2xl font-bold">
            ¡Bienvenido a nuestra plataforma!
          </h2>
        </div>
        <p className="text-gray-600">
          ¡Gestiona los tickets de soporte y accede a todos nuestros recursos!
        </p>

        <div className="space-y-3">
          <Link
            to="/signup"
            className="mb-4 text-decoration-none flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors group"
          >
            <FaUserPlus className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
            <span className="p-2 font-medium text-gray-700 group-hover:text-primary-700">
              Crear nueva cuenta
            </span>
          </Link>

          <Link
            onClick={handleLogin}
            className="mb-4 text-decoration-none flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-primary-50 transition-colors group"
          >
            <FaSignInAlt className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
            <span className="p-2 font-medium text-gray-700 group-hover:text-primary-700">
              Acceder a mi cuenta
            </span>
          </Link>
        </div>

        <p className="text-sm text-gray-500">
          ¿Necesitas ayuda?{" "}
          <Link
            to="/help"
            className="text-decoration-none text-primary-600 hover:text-primary-700 underline"
          >
            Consulta nuestra guía rápida
          </Link>
        </p>
      </Transition>
    </>
  );
};
const ProfileContent = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accounts } = useMsal();
  const userEmail = accounts[0]?.username || '';

  // Función para obtener los tickets del usuario
  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      // Reemplazar con tu endpoint real de Spring Boot
      const responseUser = await getUserId(userEmail)
      const userId=responseUser.data;
      console.log(userId);
      const response = await listTicketsByUser(userId);
      console.log(response.data.content);
      
        // if (!response.ok) {
        //   throw new Error('Error al obtener tickets');
        // }
      
      const data = response.data.content;
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener tickets al cargar el componente
  useEffect(() => {
      fetchUserTickets();
      console.log(tickets);
      
  }, []);

  return (
    <>
      <div className="flex flex-row justify-content-evenly items-center">
        <div className="flex w-96 bg-blue-950 m-2 p-1 justify-center rounded-full"></div>
        <div className="flex w-96 bg-blue-950 m-2 p-1 justify-center rounded-full"></div>
      </div>

      <div className="flex flex-row justify-content-evenly items-center flex-wrap">
        <Button
          onClick={() => setOpenDialog(true)}
          className="flex w-96 min-h-30 h-fit bg-white m-2 p-1 justify-center rounded text-decoration-none text-black hover:shadow-md transition-shadow"
        >
          <div className="flex flex-row w-90 row-auto">
            <div className="row-1 mt-auto mb-auto">
              <LiaUserAstronautSolid className="fs-1 text-blue-600" />
            </div>
            <div className="row-2 p-1">
              <h4 className="text-lg font-semibold">Generar ticket</h4>
              <div className="border-l-blue-900 border-l-3 p-1 text-sm">
                Describe tu problema rellenando el formulario de soporte.
              </div>
            </div>
          </div>
        </Button>
        
        <a
          href="/knowledge/home"
          className="flex w-96 min-h-30 h-fit bg-white m-2 p-1 justify-center rounded text-decoration-none text-black hover:shadow-md transition-shadow"
        >
          <div className="flex flex-row w-90 ">
            <div className="row-1 mt-auto mb-auto">
              <TbBulb className="fs-1 text-yellow-500" />
            </div>
            <div className="row-2 p-1">
              <h4 className="text-lg font-semibold">Base de conocimientos</h4>
              <div className="border-l-blue-900 border-l-3 p-1 text-sm">
                Encuentra soluciones a problemas comunes.
              </div>
            </div>
          </div>
        </a>
        
        <CreateTicket 
          open={openDialog} 
          setOpen={setOpenDialog} 
          onTicketCreated={fetchUserTickets} // Actualizar lista después de crear
        />
      </div>

      {/* SECCIÓN DE TICKETS DEL USUARIO */}
      <div className="mx-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Mis Tickets</h3>
          <button 
            onClick={fetchUserTickets}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            disabled={loading}
          >
            <FaSync className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No has creado ningún ticket aún</p>
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Crear mi primer ticket
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Título</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Fecha de creacion</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Fecha de expiración</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Prioridad</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">#{ticket.id}</td>
                    <td className="py-3 px-4">
                      <Link 
                        to={`/helpdesk/task/${ticket.id}`} 
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-decoration-none"
                      >
                        {ticket.tema}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.status === 'ABIERTO' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'EN_PROGRESO' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'CERRADO' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(ticket.fechaCreacion).toLocaleDateString()}
                    </td><td className="py-3 px-4 text-sm text-gray-600">
                      {ticket.fechaVencimiento}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ticket.prioridad === 1 ? 'bg-red-100 text-red-800' :
                        ticket.prioridad === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="m-4"></div>
      </div>
    </>
  );
};

export default Dashboard;