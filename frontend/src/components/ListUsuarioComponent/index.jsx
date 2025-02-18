import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { listUsuarios } from "../../services/UsuarioService";
useState;

function ListUsuarioComponent() {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    listUsuarios().then((response)=>{
      setUsuarios(response.data);
    }).catch(error=>{
      console.error(error);
    })
  }, []);

  return (
    <>
      <h2>Lista de empleados</h2>
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
  );
}

export default ListUsuarioComponent;
