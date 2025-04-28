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
  const [rol, setRol] = useState("");
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [roles, setRoles] = useState([]); // Esto guarda una lista de los roles disponibles

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

  const token = () => localStorage.getItem("authToken");
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
        toast.error("Error al cargar los roles", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get("/api/permisos", getHeaders());
        const data = await response.data;
        const filteredPermisos = data.filter(
          (permiso) => permiso.moduloId === 1
        );
        setPermisosDisponibles(filteredPermisos);
      } catch (error) {
        toast.error("Error al cargar los permisos", error);
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
          const userData = response.data;
          setNombre(userData.nombre);
          setApellido(userData.apellido);
          setEmail(userData.email);
          setRol(userData.roles && userData.roles.length > 0 ? userData.roles[0] : "");
          setSelectedPermisos(userData.permisos || []);
        })
        .catch((error) => {
          toast.error("Error al cargar el usuario", error);
        })
        .finally(() => setLoading(false));
    } else {
      setNombre("");
      setApellido("");
      setEmail("");
      setRol("");
      setSelectedPermisos([]);
      setErrors({ nombre: "", apellido: "", email: "", rol: "" });
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
      roles: rol ? [rol] : [],
      permisos: selectedPermisos,
    };

    // Pass the single rol string for validation
    if (!isFormValid({ nombre, apellido, email, rol })) return;

    setLoading(true);
    try {
      if (id) {
        await updateUser(id, userData); // Llama al servicio para actualizar el usuario
        toast.info("Usuario actualizado correctamente");
      } else {
        await signUp(userData); // Llama al servicio para crear el usuario
        toast.info("Usuario creado correctamente");
      }
      navigator("/admin/users"); // Navega a la lista de usuarios
    } catch (error) {
      // Improved error logging
      const errorMessage = error.response?.data?.message || error.message || "Error desconocido";
      toast.error(`Error al guardar los cambios del usuario: ${errorMessage}`);
      console.error("Save/Update User Error:", error.response || error);
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
    const newErrors = {
        nombre: "",
        apellido: "",
        email: "",
        rol: "",
    };

    // Validaciones
    if (!formData.nombre || formData.nombre.trim() === "") {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    }

    if (!formData.apellido || formData.apellido.trim() === "") {
      newErrors.apellido = "El apellido es obligatorio";
      valid = false;
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "El email es obligatorio";
      valid = false;
    }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El formato del email no es válido";
        valid = false;
    }

    if (!formData.rol || formData.rol.trim() === "") {
      newErrors.rol = "El Rol es obligatorio";
      valid = false;
    }

    // Actualizamos los errores
    setErrors(newErrors);
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
      <div className="container mt-4"> 
        <div className="row justify-content-center"> 
          <div className="card col-md-8 col-lg-6"> 
            <div className="card-header text-center">{pageTitle()}</div> 
            <div className="card-body">
              {/* Formulario */}
              <Form noValidate onSubmit={saveOrUpdateUser}> 
                {/* Nombre */}
                <Form.Group className="mb-3" controlId="formNombre">
                  <Form.Label>Nombre:</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingresa el nombre"
                    name="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    isInvalid={!!errors.nombre} 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Apellido */}
                <Form.Group className="mb-3" controlId="formApellido">
                  <Form.Label>Apellido:</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingresa el apellido" 
                    name="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    isInvalid={!!errors.apellido}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apellido}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    required
                    type="email" 
                    placeholder="Ingresa el Email"
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Rol */}
                <Form.Group className="mb-3" controlId="formRol">
                  <Form.Label>Rol:</Form.Label>
                  <Form.Select 
                    required
                    name="rol"
                    value={rol} 
                    onChange={(e) => setRol(e.target.value)}
                    isInvalid={!!errors.rol}
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map((r) => ( 
                      <option key={r.nombre} value={r.nombre}>
                        {r.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.rol}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Permisos */}
                <Form.Group className="mb-3"> 
                  <Form.Label>Permisos (Módulo Usuarios):</Form.Label>
                  <Row>
                    {permisosDisponibles.length > 0 ? (
                      permisosDisponibles.map((permiso) => (
                        <Col key={permiso.nombre} md={6}>
                          <Form.Check
                            type="checkbox"
                            id={`permiso-${permiso.nombre}`} 
                            label={permiso.nombre}
                            checked={selectedPermisos.includes(permiso.nombre)}
                            onChange={() =>
                              handlePermissionChange(permiso.nombre)
                            }
                            className="mb-2"
                          />
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <small className="text-muted">No hay permisos de usuario disponibles.</small>
                      </Col>
                    )}
                  </Row>
                </Form.Group>
                {loading && (
                  <Alert variant="info" className="mt-3 text-center">
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cargando...
                  </Alert>
                )}

                {/* Botones */}
                <div className="d-flex justify-content-evenly mt-4"> 
                  <Button
                    variant="success"
                    type="submit" 
                    disabled={loading} 
                  >
                    {id ? "Actualizar" : "Guardar"} 
                  </Button>
                  <Button
                    variant="danger" 
                    onClick={() => navigator("/admin/users")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </div> 
          </div> 
        </div> 
      </div> 
    </>
  );
};

export default UsersComponent;
