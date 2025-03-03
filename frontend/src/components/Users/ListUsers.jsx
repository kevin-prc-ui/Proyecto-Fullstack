import { useEffect, useState } from "react";
import { Table, Button, Spinner, Alert, Form, InputGroup } from "react-bootstrap";
import { deleteUser, listUsers } from "../../services/UsuarioService";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import { BsFillPencilFill, BsFillTrash3Fill, BsSearch } from "react-icons/bs";
import '../../styles/index.css';

// Importando constantes y funciones de utilidad
import {
  DEFAULT_ERROR_MESSAGE,
  handleApiError,
  formatUserRole,
} from "../../utils/utils";

/**
 * Componente para listar usuarios.
 * Muestra una tabla con la información de los usuarios y permite
 * agregar, editar y eliminar usuarios.
 */
function ListUsuarioComponent() {
  const isAuth = useIsAuthenticated(); // Hook para verificar si el usuario está autenticado
  const [usuarios, setUsuarios] = useState([]); // Estado para la lista de usuarios
  const [loading, setLoading] = useState(true); // Estado para indicar si se están cargando los datos
  const [errorConexion, setErrorConexion] = useState(false); // Estado para indicar si hubo un error de conexión
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [sortColumn, setSortColumn] = useState(null); // Estado para la columna por la que se está ordenando
  const [sortOrder, setSortOrder] = useState("asc"); // Estado para el orden de ordenamiento (ascendente/descendente)
  const navigator = useNavigate(); // Hook para la navegación

  /**
   * Efecto que se ejecuta al montar el componente y cuando cambia el estado de autenticación.
   * Si el usuario está autenticado, obtiene la lista de usuarios.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers();
    };

    if (isAuth) fetchUsers();
  }, [isAuth]);

  /**
   * Obtiene la lista de todos los usuarios.
   * Actualiza el estado de `usuarios`, `loading` y `errorConexion`.
   */
  async function getAllUsers() {
    setLoading(true); // Mostrar el spinner de carga
    setErrorConexion(false);
    try {
      const response = await listUsers(); // Llama al servicio para obtener los usuarios
      setUsuarios(response.data); // Actualiza el estado con la lista de usuarios
    } catch (error) {
      setErrorConexion(true); // Indica que hubo un error de conexión
      handleApiError(error, "Error al obtener la lista de usuarios");
    } finally {
      setLoading(false); // Oculta el spinner de carga
    }
  }

  /**
   * Navega a la página para agregar un nuevo usuario.
   */
  function addNewUser() {
    navigator("/helpdesk/add-user");
  }

  /**
   * Navega a la página para editar un usuario.
   * @param {number} id - ID del usuario a editar.
   */
  function updateUser(id) {
    navigator(`/helpdesk/edit-user/${id}`);
  }

  /**
   * Elimina un usuario.
   * @param {number} id - ID del usuario a eliminar.
   */
  function removeUser(id) {
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      deleteUser(id) // Llama al servicio para eliminar el usuario
        .then(() => {
          // Elimina al usuario del estado
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        })
        .catch((error) => {
          handleApiError(error, "Error al eliminar el usuario");
        });
    }
  }

  /**
   * Función para manejar la búsqueda de usuarios.
   * @param {Event} e - Evento de cambio en el campo de búsqueda.
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Función para ordenar la tabla por una columna específica.
   * @param {string} column - Nombre de la columna por la que se va a ordenar.
   */
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  /**
   * Filtra la lista de usuarios basándose en el término de búsqueda.
   */
  const filteredUsuarios = usuarios.filter((usuario) => {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
    const email = usuario.email.toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      nombreCompleto.includes(term) ||
      email.includes(term)
    );
  });

  /**
   * Ordena la lista de usuarios basándose en la columna y el orden de ordenamiento.
   */
  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (sortColumn) {
      const aValue =
        sortColumn === "nombre"
          ? `${a.nombre} ${a.apellido}`.toLowerCase()
          : a[sortColumn];
      const bValue =
        sortColumn === "nombre"
          ? `${b.nombre} ${b.apellido}`.toLowerCase()
          : b[sortColumn];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Si el usuario no está autenticado, muestra un mensaje
  if (!isAuth) {
    return <Alert variant="warning">Por favor inicie sesión primero.</Alert>;
  }

  // Si se están cargando los datos, muestra un spinner
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
        <h2 className="mb-0">Lista de empleados</h2>
        <Button variant="primary" onClick={addNewUser}>
          Agregar usuario
        </Button>
      </div>
      {/* Barra de busqueda */}
      <InputGroup className="mb-3">
        <InputGroup.Text id="search-icon">
          <BsSearch />
        </InputGroup.Text>
        <Form.Control
          type="search"
          placeholder="Buscar usuario por nombre o email"
          aria-label="Buscar usuario por nombre o email"
          aria-describedby="search-icon"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>

      {/* Muestra un mensaje de error si hubo un problema de conexión */}
      {errorConexion ? (
        <Alert variant="danger">
          ⚠️ {DEFAULT_ERROR_MESSAGE}
        </Alert>
      ) : usuarios.length === 0 ? (
        // Muestra un mensaje si no hay usuarios registrados
        <Alert variant="info">No se encontraron usuarios registrados.</Alert>
      ) : (
        // Muestra la tabla de usuarios si hay datos y no hay error
        <Table striped bordered hover responsive className="user-table">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort("id")}>#</th>
              <th onClick={() => handleSort("nombre")} className="sortable-header">
                Nombre
                {sortColumn === "nombre" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
              <th onClick={() => handleSort("apellido")} className="sortable-header">
                Apellido
                {sortColumn === "apellido" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
              <th onClick={() => handleSort("email")} className="sortable-header">
                Email
                {sortColumn === "email" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{formatUserRole(usuario.rolId)}</td>
                <td>
                  <div className="action-buttons">
                    <Button
                      onClick={() => updateUser(usuario.id)}
                      aria-label="Editar usuario"
                      className="edit-button"
                    >
                      <BsFillPencilFill />
                    </Button>
                    <Button
                      onClick={() => removeUser(usuario.id)}
                      aria-label="Eliminar usuario"
                      className="delete-button"
                    >
                      <BsFillTrash3Fill />
                    </Button>
                  </div>
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
