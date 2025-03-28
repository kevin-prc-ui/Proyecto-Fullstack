import "../styles/index.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { TbBulb } from "react-icons/tb";
import { LiaUserAstronautSolid } from "react-icons/lia";
import { Transition } from "@headlessui/react";
import { FaRegHandPeace, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { UseLoginHandler } from "../components/MicrosoftAuth/ButtonHandler";

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
  return (
    <>
      <div className="flex flex-row justify-content-evenly items-center">
        <div className="flex w-96 bg-blue-950 m-2 p-1 justify-center rounded-full"></div>
        <div className="flex w-96 bg-blue-950 m-2 p-1 justify-center rounded-full"></div>
      </div>

      <div className="flex flex-row justify-content-evenly items-center">
        <a
          href="/helpdesk/tasks"
          className="flex w-96 min-h-30 h-fit bg-white m-2 p-1 justify-center rounded text-decoration-none text-black"
        >
          <div className="flex flex-row w-90 row-auto">
            <div className="row-1 mt-auto mb-auto">
              <LiaUserAstronautSolid className="fs-1" />
            </div>
            <div className="row-2 p-1">
              <h4>Generar ticket</h4>
              <div className="border-l-blue-900 border-l-3 p-1">
                Describe tu problema rellenando el formulario de soporte.
              </div>
            </div>
          </div>
        </a>
        <a
          href="/helpdesk/tasks"
          className="flex w-96 min-h-30 h-fit bg-white m-2 p-1 justify-center rounded text-decoration-none text-black"
        >
          <div className="flex flex-row w-90 ">
            <div className="row-1 mt-auto mb-auto">
              <TbBulb className="fs-1" />
            </div>
            <div className="row-2 p-1">
              <h4>Base de conocimientos</h4>
              <div className="border-l-blue-900 border-l-3 p-1">
                Texto de base de conocimientos
              </div>
            </div>
          </div>
        </a>
      </div>
    </>
  );
};

export default Dashboard;
