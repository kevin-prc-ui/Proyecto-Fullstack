import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { listUsers } from "../../services/UsuarioService";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { BsFillPencilFill } from "react-icons/bs";

function ListUsuarioComponent() {
  const isAuth = useIsAuthenticated();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUsers();
        setUsuarios(response.data);
      } catch (error) {
        setErrorConexion(true);
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuth) fetchUsers();
  }, [isAuth]); // Agregamos isAuth como dependencia

  function addNewUser() {
    navigator('/helpdesk/add-user');
  }

  function updateUser(id) {
    navigator(`/helpdesk/edit-user/${id}`);
  }

  if (!isAuth) {
    return <Alert variant="warning">Por favor inicie sesión primero.</Alert>;
  }

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de empleados</h2>
        <Button variant="primary" onClick={addNewUser}>
          Agregar usuario
        </Button>
      </div>

      {errorConexion ? (
        <Alert variant="danger">
          ⚠️ Error de conexión con el servidor. Intente nuevamente más tarde.
        </Alert>
      ) : usuarios.length === 0 ? (
        <Alert variant="info">No se encontraron usuarios registrados.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
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
                <td>
                  <Button 
                    variant="outline-warning" 
                    onClick={() => updateUser(usuario.id)}
                    aria-label="Editar usuario"
                  >
                    <BsFillPencilFill />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default ListUsuarioComponent;