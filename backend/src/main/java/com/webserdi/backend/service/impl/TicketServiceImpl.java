// TicketService.java
package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.entity.*;
import com.webserdi.backend.exception.BusinessException;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.TicketMapper;
import com.webserdi.backend.repository.*;
import com.webserdi.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {


    private final char[] caracteres = { 'A', 'B' ,'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};
    private final TicketRepository ticketRepository;
    private final UsuarioRepository usuarioRepository;
    private final DepartamentoRepository departamentoRepository;
    private final FuenteRepository fuenteRepository;
    private final IncidenciaRepository incidenciaRepository;
    private final MotivoRepository motivoRepository;
    private final PrioridadRepository prioridadRepository;
    private final TicketMapper ticketMapper;
    private final EstadoRepository estadoRepository;

    @Override
    @Transactional
    public TicketDto createTicket(TicketDto dto) {
        try {
            dto.setIsTrashed(false);
            Ticket ticket = ticketMapper.toEntity(dto);
            ticket.setCodigo(generateNextCodigo());
            setRelationships(dto, ticket);
            return ticketMapper.toDto(ticketRepository.save(ticket));
        } catch (IllegalStateException e) {
            throw new BusinessException("Error generando código: " + e.getMessage());
        }
    }

    private void setRelationships(TicketDto dto, Ticket ticket) {
        ticket.setUsuarioCreador(usuarioRepository.findById(dto.getUsuarioCreador())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado")));
        if(dto.getUsuarioAsignado() != null) {
            ticket.setUsuarioAsignado(usuarioRepository.findById(dto.getUsuarioAsignado())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario asignado no encontrado")));
        }
        ticket.setDepartamento(departamentoRepository.findById(dto.getDepartamento())
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado")));
        ticket.setFuente(fuenteRepository.findById(dto.getFuente())
                .orElseThrow(() -> new ResourceNotFoundException("Fuente no encontrada")));
        ticket.setIncidencia(incidenciaRepository.findById(dto.getIncidencia())
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada")));
        ticket.setMotivo(motivoRepository.findById(dto.getMotivo())
                .orElseThrow(() -> new ResourceNotFoundException("Motivo no encontrado")));
        ticket.setPrioridad(prioridadRepository.findById(dto.getPrioridad())
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada")));
        ticket.setEstado(estadoRepository.findById(dto.getEstado())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrada")));
    }

    @Override
    public Page<TicketDto> getAllTickets(Pageable pageable) {
        return ticketRepository.findAllByIsTrashedFalse(pageable)
                .map(ticketMapper::toDto);
    }

    @Override
    public Page<TicketDto> getTickets(Pageable pageable, String filtro) {
        return ticketRepository.findAllByEstadoNombreAndIsTrashedFalse(filtro, pageable)
                .map(ticketMapper::toDto);
    }

    @Override
    public Page<TicketDto> getAllTrashedTickets(Pageable pageable, String filtro) {
        Page<Ticket> tickets;
        tickets = ticketRepository.findAllByIsTrashedTrue(pageable);

        return tickets.map(ticketMapper::toDto);
    }

    @Override
    public TicketDto getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(ticketMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado"));
    }

    @Override
    @Transactional
    public TicketDto updateTicket(Long id, TicketDto dto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado"));

        ticket.setTema(dto.getTema());
        ticket.setCodigo(dto.getCodigo());
        ticket.setIsTrashed(dto.getIsTrashed());
        ticket.setFechaVencimiento(dto.getFechaVencimiento());
        ticket.setFechaActualizacion(LocalDateTime.now());

        setRelationships(dto, ticket);

        return ticketMapper.toDto(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado"));
        ticket.setIsTrashed(true);
        ticketRepository.save(ticket);
    }

    private String generateNextCodigo() {
        String maxCodigo = ticketRepository.findMaxCodigo();

        if (maxCodigo == null) {
            return "ATN-AA-0001";
        }

        String[] parts = maxCodigo.split("-");
        if (parts.length != 3 || !parts[0].equals("ATN")) {
            throw new IllegalStateException("Formato de código inválido");
        }

        String letras = parts[1];
        int numero = Integer.parseInt(parts[2]);

        if (numero < 9999) {
            numero++;
        } else {
            letras = incrementarLetras(letras);
            numero = 1;
        }

        return String.format("ATN-%s-%04d", letras, numero);
    }
    private String incrementarLetras(String letras) {
        char[] chars = letras.toCharArray();

        if (chars[0] == 'Z' && chars[1] == 'Z') {
            throw new IllegalStateException("Límite máximo de códigos alcanzado");
        }

        chars[1]++;
        if (chars[1] > 'Z') {
            chars[1] = 'A';
            chars[0]++;
        }
        return new String(chars);
    }
}