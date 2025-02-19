import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { listUsuarios } from "../../services/UsuarioService";

function ListUsuarioComponent() {
  const [usuarios, setUsuarios] = useState([]);
  const [errorConexion, setErrorConexion] = useState(false);

  useEffect(() => {
    listUsuarios()
      .then((response) => {
        setUsuarios(response.data);
        setErrorConexion(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorConexion(error.message === "Error de conexion con el servidor");
      });
  }, []);
  return (
    <>
      <h2>Lista de empleados</h2>
      {errorConexion ? (
        <div className="alert alert-danger">
          ⚠️ No se pudo establecer la conexión con la base de datos
        </div>
      ) : (
        
        <Table striped bordered hover >
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
      )}
      
    </>
  );
}
export default ListUsuarioComponent;
