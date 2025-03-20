import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Title from "../../components/Ticket/Title";
import Button from "../../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../../components/Tabs/Tabs";
import TaskTitle from "../../components/Ticket/Title";
import BoardView from "../../components/Ticket/BoardView";
import Table from "../../components/Ticket/Table";
import AddTask from "../../components/Ticket/Title";
import { toast } from "sonner";
import axios from "axios";
import { listTickets } from "../../services/TicketService";
import { useIsAuthenticated } from "@azure/msal-react";

const TABS = [
  { title: "Cuadricula", icon: <MdGridView /> },
  { title: "Lista View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  
  const params = useParams();
  const isAuth = useIsAuthenticated(); // Hook para verificar si el usuario está autenticado
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickets,setTickets] = useState([]);
  const [errorConexion, setErrorConexion] = useState(false); // Estado para indicar si hubo un error de conexión

  

  const status = params?.status || "";

  useEffect(() => {
      const fetchTickets = async () => {
        await getAllTickets();
      };
  
      if (isAuth) fetchTickets();
    }, [isAuth]);
  
    /**
     * Obtiene la lista de todos los usuarios.
     * Actualiza el estado de `usuarios`, `loading` y `errorConexion`.
     */
    async function getAllTickets() {
      setLoading(true); // Mostrar el spinner de carga
      try {
        const response = await listTickets(); // Llama al servicio para obtener los usuarios
        setTickets(response.data); // Actualiza el estado con la lista de usuarios
      } catch (error) {
        setErrorConexion(error!=null); // Indica que hubo un error de conexión
      } finally {
        setLoading(false); // Oculta el spinner de carga
      }
    }

  return loading ? (
    <div className='py-10'>
      <div className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        {/* <Title title={status ? `${status} Tasks` : "Tasks"} /> */}

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>

        {selected !== 1 ? (
          <BoardView tickets={tickets} />
        ) : (
          <div className='w-full'>
            <Table tickets={tickets} />
          </div>
        )}
      </Tabs>

      {/* <AddTask open={open} setOpen={setOpen} /> */}
    </div>
  );
};

export default Tasks;