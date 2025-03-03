import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Helpdesk/Login";
import TaskDetails from "./pages/Helpdesk/TaskDetails";
import Tasks from "./pages/Helpdesk/Tasks";
import Trash from "./pages/Helpdesk/Trash";
import Users from "./pages/Helpdesk/Users";
import Dashboard from "./pages/dashboard";
import Home  from "./pages/Knowledge/Home";
import MyFile  from "./pages/Knowledge/MyFile";
import SharedFile  from "./pages/Knowledge/SharedFile";
import Sites  from "./pages/Knowledge/Sites";
import Task  from "./pages/Knowledge/Task";
import People  from "./pages/Knowledge/People";
import Repository  from "./pages/Knowledge/Repository";
import AdminTools  from "./pages/Knowledge/AdminTools";
import UsersComponent from "./components/Users/UsersComponent";
import Footer from "./components/Footer";

function Layout() {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/6 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="p-4 2xl:px-10 flex-1">
          <Outlet />
        </div>
        <Footer /> {/* Add Footer here */}
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
          <Route path="/helpdesk/tasks" element={<Tasks />} />
          <Route path="/helpdesk/completed/:status" element={<Tasks />} />
          <Route path="/helpdesk/in-progress/:status" element={<Tasks />} />
          <Route path="/helpdesk/todo/:status" element={<Tasks />} />
          <Route path="/helpdesk/task/:id" element={<TaskDetails />} />
          <Route path="/helpdesk/users" element={<Users />} />
          <Route path="/helpdesk/trash" element={<Trash />} />
          <Route path="/helpdesk/add-user" element={<UsersComponent />} />
          <Route path="/helpdesk/edit-user/:id" element={<UsersComponent />} />
          <Route path="/knowledge/home" element={<Home />} />
          <Route path="/knowledge/myfile" element={<MyFile />} />
          <Route path="/knowledge/sharedfile" element={<SharedFile />} />
          <Route path="/knowledge/sites" element={<Sites />} />
          <Route path="/knowledge/task" element={<Task />} />
          <Route path="/knowledge/people" element={<People />} />
          <Route path="/knowledge/repository" element={<Repository />} />
          <Route path="/knowledge/admintools" element={<AdminTools />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster richColors />
    </main>
  );
}
export default App;
