import React from "react";
import { Button, Alert, Form, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { useEffect, useState } from "react";
import { signUp, getUserById, updateUser } from "../../services/UsuarioService";
import { listAllDepartamentos } from "../../services/DepartamentoService";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

/**
 * Componente para agregar o editar un usuario con activación/desactivación de perfil.
 */
const UsersComponent = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [isEnabled, setIsEnabled] = useState(true); // Estado para activar/desactivar perfil
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [departamentoId, setDepartamentoId] = useState("");
  const [departamentosDisponibles, setDepartamentosDisponibles] = useState([]);
  const [roles, setRoles] = useState([]);

  // Estado para almacenar los errores de validación
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
    departamentoId: "",
  });

  const { id } = useParams();
  const navigator = useNavigate();
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
        setRoles(response.data);
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
        const data = response.data;
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

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await listAllDepartamentos();
        setDepartamentosDisponibles(response.data);
      } catch (error) {
        toast.error("Error al cargar los departamentos", error);
        console.error("Error fetching departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

  /**
   * Efecto que carga los datos del usuario cuando se está editando
   */
  useEffect(() => {
    if (id) {
      setLoading(true);
      getUserById(id)
        .then((response) => {
          const userData = response.data;
          setNombre(userData.nombre);
          setApellido(userData.apellido);
          setEmail(userData.email);
          setRol(
            userData.roles && userData.roles.length > 0 ? userData.roles[0] : ""
          );
          setDepartamentoId(userData.departamento?.id ? String(userData.departamento.id) : "");
          setSelectedPermisos(userData.permisos || []);
          setIsEnabled(userData.enabled); // Cargar estado de activación del perfil
        })
        .catch((error) => {
          toast.error("Error al cargar el usuario", error);
        })
        .finally(() => setLoading(false));
    } else {
      // Valores por defecto para nuevo usuario
      setNombre("");
      setApellido("");
      setEmail("");
      setRol("");
      setSelectedPermisos([]);
      setDepartamentoId("");
      setIsEnabled(true); // Nuevo usuario activo por defecto
      setErrors({ nombre: "", apellido: "", email: "", rol: "", departamentoId: "" });
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
   */
  const saveOrUpdateUser = async (e) => {
    e.preventDefault();
    
    const userData = {
      nombre,
      enabled: isEnabled, // Usar el estado de activación
      apellido,
      email,
      roles: rol ? [rol] : [],
      permisos: selectedPermisos,
      departamento: departamentoId ? { id: parseInt(departamentoId) } : null,
    };

    if (!isFormValid({ nombre, apellido, email, rol, departamentoId })) return;

    setLoading(true);
    try {
      if (id) {
        await updateUser(id, userData);
        toast.info("Usuario actualizado correctamente");
      } else {
        await signUp(userData);
        toast.info("Usuario creado correctamente");
      }
      navigator("/admin/helpdesk/users");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Error desconocido";
      toast.error(`Error al guardar los cambios del usuario: ${errorMessage}`);
      console.error("Save/Update User Error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica si el formulario es válido.
   */
  const isFormValid = (formData) => {
    let valid = true;
    const newErrors = {
      nombre: "",
      apellido: "",
      enabled:"",
      email: "",
      rol: "",
      departamentoId: "",
    };

    // Validaciones (sin cambios)
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido";
      valid = false;
    }

    if (!formData.rol || formData.rol.trim() === "") {
      newErrors.rol = "El Rol es obligatorio";
      valid = false;
    }

    if (!formData.departamentoId || String(formData.departamentoId).trim() === "") {
      newErrors.departamentoId = "El departamento es obligatorio";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /**
   * Retorna el título de la página
   */
  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Editar usuario</h2>;
    } else {
      return <h2 className="text-center">Agregar usuario</h2>;
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="card col-md-8 col-lg-6">
          <div className="card-header text-center">{pageTitle()}</div>
          <div className="card-body">
            <Form noValidate onSubmit={saveOrUpdateUser}>
              {/* Estado del perfil (solo para edición) */}
              {id && (
                <Form.Group className="mb-4">
                  <Form.Label>Estado del perfil:</Form.Label>
                  <ToggleButtonGroup 
                    type="radio" 
                    name="isEnabled" 
                    value={isEnabled}
                    onChange={(val) => setIsEnabled(val)}
                    className="w-100"
                  >
                    <ToggleButton
                      id="tbg-radio-enabled"
                      value={true}
                      variant={isEnabled ? "success" : "outline-success"}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Perfil activo
                    </ToggleButton>
                    <ToggleButton
                      id="tbg-radio-disabled"
                      value={false}
                      variant={!isEnabled ? "danger" : "outline-danger"}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Perfil inactivo
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Form.Text className="text-muted">
                    {isEnabled 
                      ? "El usuario puede iniciar sesión y usar el sistema" 
                      : "El usuario no podrá iniciar sesión ni usar el sistema"}
                  </Form.Text>
                </Form.Group>
              )}

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

              {/* Departamento */}
              <Form.Group className="mb-3" controlId="formDepartamento">
                <Form.Label>Departamento:</Form.Label>
                <Form.Select
                  required
                  name="departamentoId"
                  value={departamentoId}
                  onChange={(e) => setDepartamentoId(e.target.value)}
                  isInvalid={!!errors.departamentoId}
                >
                  <option value="">Seleccione un departamento</option>
                  {departamentosDisponibles.map((depto) => (
                    <option key={depto.id} value={depto.id}>
                      {depto.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.departamentoId}
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
                      <small className="text-muted">
                        No hay permisos de usuario disponibles.
                      </small>
                    </Col>
                  )}
                </Row>
              </Form.Group>
              
              {loading && (
                <Alert variant="info" className="mt-3 text-center">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Cargando...
                </Alert>
              )}

              {/* Botones */}
              <div className="d-flex justify-content-evenly mt-4">
                <Button variant="success" type="submit" disabled={loading}>
                  {"Guardar"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => navigator("/admin/helpdesk/users")}
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
  );
};

export default UsersComponent;