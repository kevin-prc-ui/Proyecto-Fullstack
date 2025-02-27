import { useEffect, useState } from "react";
import { Table, Button} from "react-bootstrap";
import { listUsuarios } from "../../services/UsuarioService";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

function ListUsuarioComponent() {
  const isAuth = useIsAuthenticated();
  const [usuarios, setUsuarios] = useState([]);
  const navigator = useNavigate();

  const [errorConexion, setErrorConexion] = useState(false);

  useEffect(() => {
    listUsuarios()
      .then((response) => {
        setUsuarios(response.data);
        setErrorConexion(false);
      })
      .catch((error) => {
        setErrorConexion(error.message === "Error de conexion con el servidor");
      });
  }, []);

  function addNewUser(){
    navigator('/helpdesk/add-user')
  }

  if (isAuth) {
    return (
      <>
        <h2>Lista de empleados</h2>
        {errorConexion ? (
          <div className="alert alert-danger">
            ⚠️ No se pudo establecer la conexión con la base de datos
          </div>
        ) : (
          <>
          <Button variant="primary" className="mb-3" onClick={addNewUser} >Agregar usuario</Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rolId}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </>
        )}
      </>
    );
  }
  return <>Inicie sesion primero.</>;
}
export default ListUsuarioComponent;
