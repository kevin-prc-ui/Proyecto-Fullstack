package com.webserdi.backend.controller;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // Usar ResponseEntity para más control
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    /**
     * Crea un nuevo ticket.
     * @param dto El DTO del ticket a crear.
     * @return El DTO del ticket creado con estado HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody TicketDto dto) {
        TicketDto createdTicket = ticketService.createTicket(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    /**
     * Obtiene una lista paginada de todos los tickets activos.
     * @param pageable Configuración de paginación (tamaño, página, orden).
     * @param departamento Nombre del departamento para filtrar (opcional).
     * @return Página de DTOs de tickets.
     */
    @GetMapping("/all")
    public ResponseEntity<Page<TicketDto>> getAllTickets(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @RequestParam(required = false) String departamento) {
        return ResponseEntity.ok(ticketService.getAllTickets(pageable, departamento));
    }
    @GetMapping("/user/{id}")
    public ResponseEntity<Page<TicketDto>> getTicketsByUsuario(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @PathVariable Long id,
            @RequestParam(required = false) String departamento) {
        return ResponseEntity.ok(ticketService.GetTicketsByUsuario(pageable, id, departamento));
    }
    @PutMapping("/restore/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void restoreTicket(@PathVariable Long id) {
        ticketService.restoreTicket(id);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TicketDto>> getTicketsByTema(
            @PageableDefault(size = 8, sort = "fechaVencimiento") Pageable pageable,
            @RequestParam String busqueda) {
        return ResponseEntity.ok(ticketService.getTicketsByTema(pageable, busqueda));
    }

                    /**
                     * Obtiene una lista paginada de tickets activos, filtrados por estado y opcionalmente por departamento.
                     * @param pageable Configuración de paginación.
                     * @param filtro Nombre del estado para filtrar.
                     * @param departamento Nombre del departamento para filtrar (opcional).
                     * @return Página de DTOs de tickets.
                     */
    @GetMapping
    public ResponseEntity<Page<TicketDto>> getTickets(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @RequestParam(required = false) String filtro, // Debería llamarse 'estado' o 'estadoNombre' para claridad
            @RequestParam(required = false) String departamento) {
        return ResponseEntity.ok(ticketService.getTickets(pageable, filtro, departamento));
    }

    /**
     * Obtiene una lista paginada de todos los tickets en la papelera.
     * @param pageable Configuración de paginación.
     * @param filtro Parámetro de filtro (actualmente no utilizado en la implementación del servicio).
     * @return Página de DTOs de tickets en la papelera.
     */
    @GetMapping("/trashed")
    public ResponseEntity<Page<TicketDto>> getAllTrashedTickets(
            @PageableDefault(size = 8, sort = "fechaCreacion") Pageable pageable,
            @RequestParam(required = false) String filtro) {
        return ResponseEntity.ok(ticketService.getAllTrashedTickets(pageable, filtro));
    }

    /**
     * Obtiene un ticket específico por su ID.
     * @param id El ID del ticket.
     * @return El DTO del ticket encontrado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    /**
     * Actualiza un ticket existente.
     * @param id El ID del ticket a actualizar.
     * @param dto El DTO con los datos actualizados del ticket.
     * @return El DTO del ticket actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable Long id, @RequestBody TicketDto dto) {
        return ResponseEntity.ok(ticketService.updateTicket(id, dto));
    }
    @PutMapping("/status/{id}")
    public ResponseEntity<TicketDto> updateStatus(@PathVariable Long id, @RequestParam Long estadoId) {
        return ResponseEntity.ok(ticketService.updateStatus(id, estadoId));
    }

    /**
     * Mueve un ticket a la papelera (soft delete).
     * @param id El ID del ticket a eliminar lógicamente.
     * @return Respuesta sin contenido con estado HTTP 204 (No Content).
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Alternativa a ResponseEntity<Void>
    public void deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        // return ResponseEntity.noContent().build(); // Si no se usa @ResponseStatus
    }

    /**
     * Restaura un ticket desde la papelera.
     * @param id El ID del ticket a restaurar.
     * @return Respuesta sin contenido con estado HTTP 204 (No Content).
     */

}