import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import {Toaster} from 'sonner';
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login";
import Tasks from './pages/Tasks';
import Trash from './pages/Trash';
import Users from './pages/Users';

function Layout(){
  const user=""
  const location = useLocation()

  return user?(
    <>
      <div className='w-full h-screen flex flex-col md:flex-row'>
        <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'></div>
        {/* <Sidebar></Sidebar> */}
      </div>
      {/* <MobileSidebar></MobileSidebar> */}
      <div className="flex-1 overflow-y-auto">
        <div className='p-4 2x1:px-10'>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  ) : (
    <Navigate to="/login" state={{from: location}} replace></Navigate>
  )
}
function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Navigate to='/dashboard'/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/tasks" element={<Tasks/>}/>
          <Route path="/completed/:status" element={<Tasks/>}/>
          <Route path="/in-progress/:status" element={<Tasks/>}/>
          <Route path="/todo/:status" element={<Tasks/>}/>
          <Route path="/team" element={<Users/>}/>
          <Route path="/trash" element={<Trash/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>

      </Routes>
      <Toaster richColors></Toaster>
    </>
  );
}

export default App;
