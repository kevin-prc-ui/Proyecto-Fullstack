import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { deleteUser, listUsers } from "../../services/UsuarioService";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { BsFillPencilFill, BsFillTrash3Fill } from "react-icons/bs";


function ListUsuarioComponent() {
  const isAuth = useIsAuthenticated();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorConexion, setErrorConexion] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      getAllUsers();
    };

    if (isAuth) fetchUsers();
  }, [isAuth]); // Agregamos isAuth como dependencia

  async function getAllUsers(){
    try {
      const response = await listUsers();
      setUsuarios(response.data);
    } catch (error) {
      setErrorConexion(true);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  function addNewUser() {
    navigator("/helpdesk/add-user");
  }

  function updateUser(id) {
    navigator(`/helpdesk/edit-user/${id}`);
  }

  function removeUser(id){
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      deleteUser(id)
        .then(() => {
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("Ocurrió un error al eliminar el usuario. Intente nuevamente.");
        });
    }
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
      <h2>Lista de empleados</h2>
      <Button className="mb-4" variant="primary" onClick={addNewUser}>
        Agregar usuario
      </Button>

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
                    style={{ marginRight: "5px" }}
                    variant="outline-secondary"
                    onClick={() => updateUser(usuario.id)}
                    aria-label="Editar usuario"
                  >
                    <BsFillPencilFill />
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => removeUser(usuario.id)}
                    aria-label="Eliminar usuario"
                  >
                    <BsFillTrash3Fill />
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
