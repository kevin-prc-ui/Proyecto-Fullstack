import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { createUser, getUserById, updateUser } from "../../services/UsuarioService";
import { useNavigate, useParams } from "react-router-dom";

const UsersComponent = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rolId, setRolId] = useState("");

  const {id} = useParams(); 

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rolId: "",
  });

  const navigator = useNavigate();

  useEffect(() => {
    if (id){
      getUserById(id).then((response)=> {
        setNombre(response.data.nombre);
        setApellido(response.data.apellido);
        setEmail(response.data.email);
        setRolId(response.data.rolId);
      }).catch(error=>{
        console.error(error)
      })
    }
  },[id]);


  const saveOrUpdateUser = (e) => {
    if (!validateForm()) return;
    e.preventDefault();
    const user = { nombre, apellido, email, rolId };
    
    if (id){
      updateUser(id,user).then((response)=>{
        console.log(response.data);
        navigator('/helpdesk/users')
      }).catch(error=>{
        console.error(error)
      })
    }else{
      createUser(user).then((response)=>{
        console.log(response.data);
        navigator('/helpdesk/users')
      }).catch(error=>{
        console.error(error)
      })
    }
    
  };

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (nombre.trim()) {
      errorsCopy.nombre = "";
    } else {
      errorsCopy.nombre = "El nombre es obligatorio";
      valid = false;
    }

    if (apellido.trim()) {
      errorsCopy.apellido = "";
    } else {
      errorsCopy.apellido = "El apellido es obligatorio";
      valid = false;
    }

    if (email.trim()) {
      errorsCopy.email = "";
    } else {
      errorsCopy.email = "El email es obligatorio";
      valid = false;
    }

    if (rolId.trim()) {
      errorsCopy.rolId = "";
    } else {
      errorsCopy.rolId = "El Rol es obligatorio";
      valid = false;
    }
    setErrors(errorsCopy);
    return valid;
  }

  function pageTitle(){
    if(id) {
      return <h2 className="text-center">Editar usuario</h2>
    }
    else {
      return (<h2 className="text-center">Agregar usuario</h2>);
    }

  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3">
            <div className="text-center">
            {
              pageTitle()
            }
              <div className="card-body">
                <form>
                  <div className="form-group mb-2">
                    <label className="form-label">Nombre:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el nombre"
                      name="nombre"
                      value={nombre}
                      className={`form-control ${
                        errors.nombre ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre}</div>
                    )}
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Apellido:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el apelido"
                      name="apellido"
                      value={apellido}
                      className={`form-control ${
                        errors.apellido ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                    {errors.apellido && (
                      <div className="invalid-feedback">{errors.apellido}</div>
                    )}
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Email:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el Email"
                      name="Email"
                      value={email}
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Rol:</label>
                    <select
                      required
                      name="rolId"
                      onChange={(e) => setRolId(e.target.value)}
                      className={`form-control ${
                        errors.rolId ? "is-invalid" : ""
                      }`}
                    >
                      <option >Seleccione</option>
                      <option value="1">Administrador</option>
                      <option value="2">Staff</option>
                    </select>
                    {errors.rolId && (
                      <div className="invalid-feedback">{errors.rolId}</div>
                    )}
                  </div>
                  <div className="flex justify-content-evenly">
                    <Button className="btn btn-success" onClick={saveOrUpdateUser}>
                      Enviar
                    </Button>
                    <Button className="btn btn-danger" onClick={() => navigator('/helpdesk/users')}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersComponent;
