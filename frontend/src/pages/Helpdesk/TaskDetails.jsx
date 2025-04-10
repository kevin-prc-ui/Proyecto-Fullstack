import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getTicketById } from '../../services/TicketService';
import { toast } from 'sonner';

const TaskDetails = () => {
  const params = useParams();
  const id = params?.id || "";
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTicketById(id) // Llama al servicio para obtener el usuario por ID
        .then((response) => {
          setTicket(response.data);
        })
        .catch((error) => {
          toast.error("Error al cargar el ticket",error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>Ticket not found.</div>;
  }

  return (
    <>
    <div>Ticket ID: {id}</div>
    <div>Tema: {ticket.tema}</div>
    </>
  )
};

export default TaskDetails
