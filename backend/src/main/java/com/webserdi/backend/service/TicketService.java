package com.webserdi.backend.service;

import com.webserdi.backend.dto.TicketDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TicketService {
    TicketDto createTicket(TicketDto dto);
    Page<TicketDto> getAllTickets(Pageable pageable, String departamento);
    Page<TicketDto> GetTicketsDashboard(Pageable pageable, Long id, String departamentoNombre);
    Page<TicketDto> GetTicketsByUsuario(Pageable pageable, Long id, String departamentoNombre);
    Page<TicketDto> getTickets(Pageable pageable, String filtro, String departamento);
    Page<TicketDto> getAllTrashedTickets(Pageable pageable, String filtro);
    Page<TicketDto> getTicketsByTema(Pageable pageable, String busqueda);
    TicketDto getTicketById(Long id);
    TicketDto updateTicket(Long id, TicketDto dto);
    TicketDto updateStatus(Long id, Long estadoId);
    void deleteTicket(Long id);
    void restoreTicket(Long id);

}