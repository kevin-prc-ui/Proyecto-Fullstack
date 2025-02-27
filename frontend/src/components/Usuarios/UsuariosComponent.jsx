import { Button } from "react-bootstrap";
import { useState } from "react";
import { createUsuario } from '../../services/UsuarioService'
import { useNavigate } from "react-router-dom";

const UsuariosComponent = () => {
  const [nombre, setFirstNombre] = useState("");
  const [apellido, setFirstApellido] = useState("");
  const [email, setFirstEmail] = useState("");
  const [rolId, setFirstRolId] = useState("");

  const navigator = useNavigate();


  const saveUser = (e) => {
    e.preventDefault();
    const user = { nombre, apellido, email, rolId };
    console.log(user);
    createUsuario(user).then((response) => {
      console.log(response.data);
      navigator('/helpdesk/users')
    })
  };

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
                      className="form-control"
                      onChange={(e) => setFirstNombre(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Apellido:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el apelido"
                      name="apellido"
                      value={apellido}
                      className="form-control"
                      onChange={(e) => setFirstApellido(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-2">
                    <label className="form-label">Email:</label>
                    <input
                      required
                      type="text"
                      placeholder="Ingresa el Email"
                      name="Email"
                      value={email}
                      className="form-control"
                      onChange={(e) => setFirstEmail(e.target.value)}/>
                    </div>
                    <div className="form-group mb-2">
                      <label className="form-label">Rol:</label>
                      <select required name="rolId" onChange={(e) => setFirstRolId(e.target.value)}>
                        <option value="">Seleccione</option>
                        <option value="1">Administrador</option>
                        <option value="2">Staff</option>
                      </select>
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
