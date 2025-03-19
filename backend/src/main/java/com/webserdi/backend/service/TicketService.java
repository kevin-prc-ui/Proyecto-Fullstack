package com.webserdi.backend.service;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.entity.Ticket;

import java.util.List;

public interface TicketService {
    TicketDto createTicket(TicketDto dto);
    List<TicketDto> getAllTickets();
    TicketDto getTicketById(Long id);
    TicketDto updateTicket(Long id, TicketDto dto);
    void deleteTicket(Long id);
}
