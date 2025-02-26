import Navbar from "../../components/Navbar"

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <p>Redirecting to Microsoft login...</p>
      </div>
    </div>
    </>
    
  );
};

export default Login;