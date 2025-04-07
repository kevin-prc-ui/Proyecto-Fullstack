// TicketController.java
package com.webserdi.backend.controller;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketDto createTicket(@RequestBody TicketDto dto) {
        return ticketService.createTicket(dto);
    }

    @GetMapping("/all")
    public Page<TicketDto> getAllTickets(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @RequestParam(required = false) String filtro) {
        return ticketService.getAllTickets(pageable, filtro);
    }

    @GetMapping()
    public Page<TicketDto> getTickets(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @RequestParam(required = false) String filtro) {
        return ticketService.getTickets(pageable, filtro);
    }

    @GetMapping("/trashed")
    public Page<TicketDto> getAllTrashedTickets(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @RequestParam(required = false) String filtro) {
        return ticketService.getAllTrashedTickets(pageable, filtro);
    }
    @GetMapping("/{id}")
    public TicketDto getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PutMapping("/{id}")
    public TicketDto updateTicket(@PathVariable Long id, @RequestBody TicketDto dto) {
        return ticketService.updateTicket(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
    }
}