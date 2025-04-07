package com.webserdi.backend.service;

import com.webserdi.backend.dto.TicketDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TicketService {
    TicketDto createTicket(TicketDto dto);
    Page<TicketDto> getAllTickets(Pageable pageable, String filtro);
    Page<TicketDto> getTickets(Pageable pageable, String filtro);
    TicketDto getTicketById(Long id);
    TicketDto updateTicket(Long id, TicketDto dto);
    void deleteTicket(Long id);
    Page<TicketDto> getAllTrashedTickets(Pageable pageable, String filtro);
}