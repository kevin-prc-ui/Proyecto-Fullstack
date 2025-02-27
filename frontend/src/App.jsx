// import { Transition } from "@headlessui/react";
// import clsx from "clsx";
// import { Fragment, useRef } from "react";
// import { IoClose } from "react-icons/io5";
// import { useDispatch, useSelector } from "react-redux";
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
// import { setOpenSidebar } from "./redux/slices/authSlice";
// import { useIsAuthenticated } from "@azure/msal-react";
import Home  from "./pages/Knowledge/Home";
import MyFile  from "./pages/Knowledge/MyFile";
import SharedFile  from "./pages/Knowledge/SharedFile";
import Sites  from "./pages/Knowledge/Sites";
import Task  from "./pages/Knowledge/Task";
import People  from "./pages/Knowledge/People";
import Repository  from "./pages/Knowledge/Repository";
import AdminTools  from "./pages/Knowledge/AdminTools";
import UsuariosComponent from "./components/Usuarios/UsuariosComponent";

function Layout() {
  // const isAuthenticated = useIsAuthenticated();
  // const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/6 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      {/* <MobileSidebar /> */}
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
//Logica para el sidebar en celulares no implementada aun
// const MobileSidebar = () => {
//   const { isSidebarOpen } = useSelector((state) => state.auth);
//   const mobileMenuRef = useRef(null);
//   const dispatch = useDispatch();

//   const closeSidebar = () => {
//     dispatch(setOpenSidebar(false));
//   };

//   return (
//     <>
//       <Transition
//         show={isSidebarOpen}
//         as={Fragment}
//         enter='transition-opacity duration-700'
//         enterFrom='opacity-x-10'
//         enterTo='opacity-x-100'
//         leave='transition-opacity duration-700'
//         leaveFrom='opacity-x-100'
//         leaveTo='opacity-x-0'
//       >
//         {(ref) => (
//           <div
//             ref={(node) => (mobileMenuRef.current = node)}
//             className={clsx(
//               "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
//               isSidebarOpen ? "translate-x-0" : "translate-x-full"
//             )}
//             onClick={() => closeSidebar()}
//           >
//             <div className='bg-white w-3/4 h-full'>
//               <div className='w-full flex justify-end px-5 mt-5'>
//                 <button
//                   onClick={() => closeSidebar()}
//                   className='flex justify-end items-end'
//                 >
//                   <IoClose size={25} />
//                 </button>
//               </div>

//               <div className='-mt-10'>
//                 <Sidebar />
//               </div>
//             </div>
//           </div>
//         )}
//       </Transition>
//     </>
//   );
// };

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6] ">
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
          <Route path="/helpdesk/add-user" element={<UsuariosComponent />} />
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
