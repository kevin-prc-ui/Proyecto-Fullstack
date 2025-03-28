// components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { Transition } from "@headlessui/react";
import Sidebar from "../components/Sidebar";
import { Navbar } from "react-bootstrap";
import Footer from "../components/Footer";

export const ProtectedRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return (
    <Transition
      as="div"
      appear
      show
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <div className="w-full h-screen flex flex-col md:flex-row">
        <div className="w-1/6 h-screen bg-white min-w-53 sticky top-0 hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar />
          <div className="p-4 2xl:px-10 flex-1">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </Transition>
  );
};