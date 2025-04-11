package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.entity.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketDto toDto(Ticket ticket){
        TicketDto ticketDto = new TicketDto();
        ticketDto.setId(ticket.getId());
        ticketDto.setTema(ticket.getTema());
        ticketDto.setCodigo(ticket.getCodigo());
        ticketDto.setIsTrashed(ticket.getIsTrashed());
        ticketDto.setFechaCreacion(ticket.getFechaCreacion());
        ticketDto.setFechaActualizacion(ticket.getFechaActualizacion());
        ticketDto.setFechaVencimiento(ticket.getFechaVencimiento());
        ticketDto.setUsuarioCreador(ticket.getUsuarioCreador().getId());
        ticketDto.setUsuarioAsignado(ticket.getUsuarioAsignado().getId());
        ticketDto.setUsuarioCreadorNombres(ticket.getUsuarioCreador().getNombre()+" "+ticket.getUsuarioCreador().getApellido());
        ticketDto.setUsuarioAsignadoNombres(ticket.getUsuarioAsignado().getNombre() +" "+ticket.getUsuarioAsignado().getApellido());
        ticketDto.setDepartamento(ticket.getDepartamento().getId());
        ticketDto.setDepartamentoNombre(ticket.getDepartamento().getNombre());
        ticketDto.setFuente(ticket.getFuente().getId());
        ticketDto.setFuenteNombre(ticket.getFuente().getNombre());
        ticketDto.setIncidencia(ticket.getIncidencia().getId());
        ticketDto.setIncidenciaNombre(ticket.getIncidencia().getNombre());
        ticketDto.setMotivo(ticket.getMotivo().getId());
        ticketDto.setMotivoNombre(ticket.getMotivo().getNombre());
        ticketDto.setPrioridad(ticket.getPrioridad().getId());
        ticketDto.setPrioridadNombre(ticket.getPrioridad().getNombre());
        ticketDto.setEstado(ticket.getEstado().getId());
        ticketDto.setEstadoNombre(ticket.getEstado().getNombre());
        return ticketDto;
    }

    public Ticket toEntity(TicketDto dto){
        Ticket ticket = new Ticket();
        ticket.setId(dto.getId());
        ticket.setTema(dto.getTema());
        ticket.setCodigo(dto.getCodigo());
        ticket.setIsTrashed(dto.getIsTrashed());
        ticket.setFechaCreacion(dto.getFechaCreacion());
        ticket.setFechaActualizacion(dto.getFechaActualizacion());
        ticket.setFechaVencimiento(dto.getFechaVencimiento());
        return ticket;
    }
}
