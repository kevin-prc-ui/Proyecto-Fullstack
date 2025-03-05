import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useMsalAuthentication, useIsAuthenticated } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Helpdesk/Login";
import TaskDetails from "./pages/Helpdesk/TaskDetails";
import Tasks from "./pages/Helpdesk/Tasks";
import Trash from "./pages/Helpdesk/Trash";
import Users from "./pages/Helpdesk/Users";
import Dashboard from "./pages/dashboard";
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
import { createContext, useContext, useEffect, useState } from "react";
import { getUserPermissions } from "./services/UsuarioService"; // Import the service to get user permissions

function Layout() {
  const isAuthenticated = useIsAuthenticated();
  const [userPermissions, setUserPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const { login } = useMsalAuthentication(InteractionType.Redirect);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (isAuthenticated) {
        try {
          const permissions = await getUserPermissions();
          setUserPermissions(permissions.data);
        } catch (error) {
          console.error("Error fetching user permissions:", error);
          // Handle error, maybe show a message to the user
        } finally {
          setLoadingPermissions(false);
        }
      } else {
        setLoadingPermissions(false);
      }
    };

    fetchUserPermissions();
  }, [isAuthenticated]);

  // If permissions are still loading or not authenticated, show a loading or login message
  if (loadingPermissions) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return (
      <div className="w-full h-screen flex justify-center items-center">
        <button className="btn btn-primary" onClick={() => login()}>Login</button>
      </div>
        
      )
    }

  // Check if a specific permission is granted
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row" data-theme={'dark'}>
      <div className="w-1/6 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="p-4 2xl:px-10 flex-1">
          <Outlet context={{ hasPermission }} />
        </div>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f7ff] ">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/helpdesk/tasks"
            element={
              <ProtectedRoute permission="view_tasks">
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/completed/:status"
            element={
              <ProtectedRoute permission="view_tasks">
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/in-progress/:status"
            element={
              <ProtectedRoute permission="view_tasks">
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/todo/:status"
            element={
              <ProtectedRoute permission="view_tasks">
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/task/:id"
            element={
              <ProtectedRoute permission="view_task_details">
                <TaskDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/users"
            element={
              <ProtectedRoute permission="view_users">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/trash"
            element={
              <ProtectedRoute permission="view_trash">
                <Trash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/add-user"
            element={
              <ProtectedRoute permission="create_users">
                <UsersComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/helpdesk/edit-user/:id"
            element={
              <ProtectedRoute permission="edit_users">
                <UsersComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/home"
            element={
              <ProtectedRoute permission="view_knowledge_home">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/myfile"
            element={
              <ProtectedRoute permission="view_my_files">
                <MyFile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/sharedfile"
            element={
              <ProtectedRoute permission="view_shared_files">
                <SharedFile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/sites"
            element={
              <ProtectedRoute permission="view_sites">
                <Sites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/task"
            element={
              <ProtectedRoute permission="view_knowledge_tasks">
                <Task />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/people"
            element={
              <ProtectedRoute permission="view_people">
                <People />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/repository"
            element={
              <ProtectedRoute permission="view_repository">
                <Repository />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge/admintools"
            element={
              <ProtectedRoute permission="view_admin_tools">
                <AdminTools />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster richColors />
    </main>
  );
}

// ProtectedRoute component to wrap routes based on permissions
function ProtectedRoute({ permission, children }) {
  const { hasPermission } = useContext(createContext());

  if (!hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />; // Redirect to dashboard or unauthorized page
  }

  return children;
}

export default App;
