package com.webserdi.backend.service;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TicketService {
    TicketDto createTicket(TicketDto dto);
    Page<TicketDto> getAllTickets(Pageable pageable, String filtro);
    TicketDto getTicketById(Long id);
    TicketDto updateTicket(Long id, TicketDto dto);
    void deleteTicket(Long id);
}
