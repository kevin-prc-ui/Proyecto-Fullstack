import { Button } from "react-bootstrap";
import { useState } from "react";
import { createUsuario } from '../../services/UsuarioService'
import { useNavigate } from "react-router-dom";

const UsuariosComponent = () => {
  const [nombre, setFirstNombre] = useState("");
  const [apellido, setFirstApellido] = useState("");
  const [email, setFirstEmail] = useState("");
  const [rolId, setFirstRolId] = useState("");

  const [errors, setErrors] = useState({
    nombre:"",
    apellido:"",
    email:"",
    rolId:""
  })

  const navigator = useNavigate();

  const saveUser = (e) => {
    if (!validateForm()) return;
    e.preventDefault();
    const user = { nombre, apellido, email, rolId };
    console.log(user);
    createUsuario(user).then((response) => {
      console.log(response.data);
      navigator('/helpdesk/users')
    })
  };

  function validateForm (){
    let valid=true;
    const errorsCopy = {...errors}

    if (nombre.trim()){
      errorsCopy.nombre="";
    }else{
      errorsCopy.nombre="El nombre es obligatorio";
      valid=false;
    }

    if (apellido.trim()){
      errorsCopy.apellido="";
    }else{
      errorsCopy.apellido="El apellido es obligatorio";
      valid=false;
    }
    
    if (email.trim()){
      errorsCopy.email="";
    }else{
      errorsCopy.email="El email es obligatorio";
      valid=false;
    }

    if (rolId.trim()){
      errorsCopy.rolId="";
    }else{
      errorsCopy.rolId="El Rol es obligatorio";
      valid=false;
    }
    setErrors(errorsCopy);
    return valid;
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3">
            <div className="text-center">
              <h2>Agregar usuario</h2>
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
                      className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                      onChange={(e) => setFirstNombre(e.target.value)}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Apellido:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el apelido"
                      name="apellido"
                      value={apellido}
                      className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                      onChange={(e) => setFirstApellido(e.target.value)}
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}

                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Email:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el Email"
                      name="Email"
                      value={email}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      onChange={(e) => setFirstEmail(e.target.value)}/>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}

                    </div>
                    <div className="form-group mb-2">
                      <label className="form-label">Rol:</label>
                      <select required name="rolId" onChange={(e) => setFirstRolId(e.target.value)} className={`form-control ${errors.rolId ? 'is-invalid' : ''}`}>
                        <option >Seleccione</option>
                        <option value="1">Administrador</option>
                        <option value="2">Staff</option>
                      </select>
                      {errors.rolId && <div className="invalid-feedback">{errors.rolId}</div>}
                    </div>
                    <Button className="btn btn-success" onClick={saveUser}>Enviar</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsuariosComponent;
