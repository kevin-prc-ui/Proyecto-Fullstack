import { Button, Alert, Form, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  signUp,
  getUserById,
  updateUser,
} from "../../services/UsuarioService";
import { useNavigate, useParams } from "react-router-dom";

// Importando constantes y funciones de utilidad
import axios from "axios";
import { toast } from "sonner";

/**
 * Componente para agregar o editar un usuario.
 */
const UsersComponent = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState([]);
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [roles, setRoles] = useState([]);

  // Estado para almacenar los errores de validación
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
  });

  const { id } = useParams(); // Obtiene el ID del usuario de los parámetros de la URL
  const navigator = useNavigate(); // Hook para la navegación
  const [loading, setLoading] = useState(false);

  const token = () => sessionStorage.getItem("authToken");
  const getAuthToken = () => JSON.parse(token()).accessToken;

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/api/roles", getHeaders());
        const data = await response.data;
        setRoles(data);
      } catch (error) {
        toast.error("Error al cargar los roles",error);
      }
    };
    fetchRoles();
  }, []);

  //Efecto para cargar los permisos disponibles
  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get("/api/permisos", getHeaders());
        const data = await response.data;
        // Filter permissions with modulo_id=1
        const filteredPermisos = data.filter(
          (permiso) => permiso.moduloId === 1
        );
        setPermisosDisponibles(filteredPermisos);
      } catch (error) {
        toast.error("Error al cargar los permisos",error);
      }
    };
    fetchPermisos();
  }, []);

  /**
   * Efecto que se ejecuta al montar el componente y cuando cambia el ID.
   * Si hay un ID, obtiene la información del usuario y la carga en el formulario.
   */
  useEffect(() => {
    if (id) {
      setLoading(true);
      getUserById(id) // Llama al servicio para obtener el usuario por ID
        .then((response) => {
          setNombre(response.data.nombre);
          setApellido(response.data.apellido);
          setEmail(response.data.email);
          setRol(response.data.rol);
          setSelectedPermisos(response.data.permisos || []);
        })
        .catch((error) => {
          toast.error("Error al cargar el usuario",error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePermissionChange = (permisoNombre) => {
    setSelectedPermisos((prev) => {
      if (prev.includes(permisoNombre)) {
        return prev.filter((p) => p !== permisoNombre);
      }
      return [...prev, permisoNombre];
    });
  };

  /**
   * Guarda o actualiza un usuario.
   * @param {Event} e - Evento del formulario.
   */
  const saveOrUpdateUser = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    const userData = {
      nombre,
      apellido,
      email,
      roles: [rol],
      permisos: selectedPermisos,
    };
    console.log(userData);
    // Verifica si el formulario es válido
    if (!isFormValid(userData)) return; // Si no es valido, retorna sin ejecutar la peticion
    setLoading(true);
    try {
      if (id) {
        await updateUser(id, userData); // Llama al servicio para actualizar el usuario
        toast.info("Usuario actualizado correctamente");
      } else {
        await signUp(userData); // Llama al servicio para crear el usuario
        toast.info("Usuario creado correctamente");
      }
      navigator("/admin/helpdesk/users"); // Navega a la lista de usuarios
    } catch (error) {
      toast.error(error, "Error al guardar los cambios del usuario");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica si el formulario es válido.
   * @returns {boolean} - `true` si el formulario es válido, `false` en caso contrario.
   */
  const isFormValid = (formData) => {
    let valid = true;
    const errorsCopy = { ...errors }; // Creamos una copia para no modificar el original directamente

    // Validaciones
    if (formData.nombre.trim() === "") {
      errorsCopy.nombre = "El nombre es obligatorio";
      valid = false;
    } else {
      errorsCopy.nombre = "";
    }

    if (formData.apellido.trim() === "") {
      errorsCopy.apellido = "El apellido es obligatorio";
      valid = false;
    } else {
      errorsCopy.apellido = "";
    }

    if (formData.email.trim() === "") {
      errorsCopy.email = "El email es obligatorio";
      valid = false;
    } else {
      errorsCopy.email = "";
    }

    if (formData.roles[0].trim() === "") {
      errorsCopy.roles = "El Rol es obligatorio";
      valid = false;
    } else {
      errorsCopy.roles = "";
    }

    // Actualizamos los errores
    setErrors(errorsCopy);
    return valid;
  };

  /**
   * Retorna el título de la página dependiendo si es para agregar o editar.
   * @returns {JSX.Element} - Título de la página.
   */
  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Editar usuario</h2>;
    } else {
      return <h2 className="text-center">Agregar usuario</h2>;
    }
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3">
            <div className="text-center">{pageTitle()}</div>
            <div className="card-body">
              {/* Formulario */}
              <form>
                {/* Nombre */}
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
                {/* Apellido */}
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
                {/* Email */}
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
                {/* Rol */}
                <div className="form-group mb-2">
                  <label className="form-label">Rol:</label>
                  <select
                    required
                    name="rol"
                    onChange={(e) => setRol(e.target.value)}
                    className={`form-control ${errors.rol ? "is-invalid" : ""}`}
                  >
                    <option value="">Seleccione</option>
                    {roles.map((rol) => (
                      <option key={rol.nombre} value={rol.nombre}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.rol && (
                    <div className="invalid-feedback">{errors.rol}</div>
                  )}
                </div>
                <Form.Group>
                  <Form.Label>Permisos:</Form.Label>
                  <Row>
                    {permisosDisponibles.map((permiso) => (
                      <Col key={permiso.nombre} md={6}>
                        <Form.Check
                          type="checkbox"
                          id={permiso.nombre}
                          label={permiso.nombre}
                          checked={selectedPermisos.includes(permiso.nombre)}
                          onChange={() =>
                            handlePermissionChange(permiso.nombre)
                          }
                          className="mb-2"
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
                {/* Botones */}
                {loading && (
                  <Alert variant="info" className="mt-3">
                    Cargando...
                  </Alert>
                )}
                <div className="flex justify-content-evenly">
                  <Button
                    className="btn btn-success"
                    onClick={saveOrUpdateUser}
                  >
                    Enviar
                  </Button>
                  <Button
                    className="btn btn-danger"
                    onClick={() => navigator("/admin/helpdesk/users")}
                  >
                    Cancelar
                  </Button>
                </div>
                {/* Permisos */}
                <div className="flex justify-content-evenly">
                  <div className="form-group mb-4"></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersComponent;
