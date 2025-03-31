import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TaskDetails from "./pages/Helpdesk/TaskDetails";
import Tasks from "./pages/Helpdesk/Tasks";
import Trash from "./pages/Helpdesk/Trash";
import Users from "./pages/Helpdesk/Users";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Knowledge/Home";
import MyFile from "./pages/Knowledge/MyFile";
import SharedFile from "./pages/Knowledge/SharedFile";
import Sites from "./pages/Knowledge/Sites";
import Task from "./pages/Knowledge/Task";
import People from "./pages/Knowledge/People";
import Repository from "./pages/Knowledge/Repository";
import AdminTools from "./pages/Knowledge/AdminTools";
import UsersComponent from "./components/Users/UsersComponent";
import Footer from "./components/Footer";
import { useIsAuthenticated } from "@azure/msal-react";
import MicrosoftSignUp from "./components/MicrosoftAuth/SignupButton";
import { useLocation } from "react-router-dom";
import { Transition } from "@headlessui/react";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";

function Layout() {
  const isAuthenticated = useIsAuthenticated();
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";

  return (
    <Transition
      as="div"
      appear
      show
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      className=""
    >
      <div className="w-full h-screen flex flex-col md:flex-row">
        {/* Sidebar condicional */}
        {isAuthenticated && !isDashboard && (
          <div className="w-1/6 h-screen bg-white min-w-53 sticky top-0 hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Contenido principal */}
        <div
          className={`flex-1 flex flex-col overflow-y-auto ${
            isDashboard ? "w-full" : ""
          }`}
        >
          <Navbar />
          <div className="p-4 2xl:px-10 flex flex-col">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </Transition>
  );
}

function App() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated)
    return (
      <main className="w-full min-h-screen bg-[#e7ebf3] ">
        {/* Rutas públicas */}
        <Routes>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<MicrosoftSignUp />} />
            <Route path="/notfound" element={<NotFound />} />
          </Route>
        </Routes>
      </main>
    );
  else
    return (
      <main className="w-full min-h-screen bg-[#e7ebf3] ">
        <Routes>
          <Route index path="/" element={<Navigate to="/dashboard" />} />

          {/* Rutas públicas */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<MicrosoftSignUp />} />
            <Route path="/notfound" element={<NotFound />} />
          </Route>

          {/* Rutas protegidas para usuarios autenticados */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["ROLE_USER", "ROLE_ADMIN", "ROLE_HELPDESK"]}
              />
            }
          >
            <Route element={<Layout />}>
              <Route path="/helpdesk/tasks" element={<Tasks />} />
              <Route path="/helpdesk/completado/:estado" element={<Tasks />} />
              <Route path="/helpdesk/en-proceso/:estado" element={<Tasks />} />
              <Route path="/helpdesk/todo/:estado" element={<Tasks />} />
              <Route path="/helpdesk/task/:id" element={<TaskDetails />} />
              <Route path="/helpdesk/trash" element={<Trash />} />
              <Route path="/knowledge/home" element={<Home />} />
              <Route path="/knowledge/myfile" element={<MyFile />} />
              <Route path="/knowledge/sharedfile" element={<SharedFile />} />
              <Route path="/knowledge/sites" element={<Sites />} />
              <Route path="/knowledge/task" element={<Task />} />
              <Route path="/knowledge/people" element={<People />} />
              <Route path="/knowledge/repository" element={<Repository />} />
              <Route path="/knowledge/admintools" element={<AdminTools />} />
              <Route path="/notfound" element={<NotFound />} />
            </Route>
          </Route>

          {/* Rutas solo para administradores */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route element={<Layout />}>
              <Route path="/admin/helpdesk/users" element={<Users />} />
              <Route
                path="/admin/helpdesk/add-user"
                element={<UsersComponent />}
              />
              <Route
                path="/admin/helpdesk/edit-user/:id"
                element={<UsersComponent />}
              />
              <Route path="/knowledge/admintools" element={<AdminTools />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
        <Toaster />
      </main>
    );
}
export default App;
