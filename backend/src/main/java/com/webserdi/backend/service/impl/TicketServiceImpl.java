// C:/react/Proyecto/backend/src/main/java/com/webserdi/backend/service/impl/TicketServiceImpl.java
package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.TicketDto;
import com.webserdi.backend.entity.*;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.exception.BusinessException;
import com.webserdi.backend.mapper.TicketMapper;
import com.webserdi.backend.repository.*;
import com.webserdi.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils; // Para validaciones de String

import java.time.LocalDateTime;
import java.util.Objects; // Para Objects.requireNonNull

@Service
@RequiredArgsConstructor // Lombok genera el constructor con todas las dependencias finales
public class TicketServiceImpl implements TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketServiceImpl.class);

    // Repositorios y Mappers
    private final TicketRepository ticketRepository;
    private final UsuarioRepository usuarioRepository;
    private final DepartamentoRepository departamentoRepository;
    private final FuenteRepository fuenteRepository;
    private final IncidenciaRepository incidenciaRepository;
    private final MotivoRepository motivoRepository;
    private final PrioridadRepository prioridadRepository;
    private final EstadoRepository estadoRepository;
    private final TicketMapper ticketMapper;

    /**
     * Crea un nuevo ticket basado en la información proporcionada en el DTO.
     * Genera un código único para el ticket y establece todas las relaciones necesarias.
     *
     * @param dto El {@link TicketDto} que contiene la información para crear el ticket.
     * @return El {@link TicketDto} del ticket recién creado.
     * @throws ResourceNotFoundException Si la información del DTO es inválida.
     * @throws ResourceNotFoundException Si alguna entidad relacionada (como usuario, departamento) no se encuentra.
     * @throws BusinessException Si ocurre un error durante la generación del código del ticket.
     */
    @Override
    @Transactional
    public TicketDto createTicket(TicketDto dto) {
        logger.info("Iniciando creación de ticket con DTO: {}", dto);
        validateTicketDtoForCreation(dto);

        Ticket ticket = ticketMapper.toEntity(dto);

        // Establecer valores por defecto y generados
        ticket.setIsTrashed(false); // Por defecto, un ticket nuevo no está en la papelera
        try {
            ticket.setCodigo(generateNextCodigo());
        } catch (IllegalStateException e) {
            logger.error("Error generando código para el nuevo ticket", e);
            throw new BusinessException("Error generando código del ticket: " + e.getMessage());
        }

        // Establecer relaciones con otras entidades
        setTicketRelationships(ticket, dto);

        // El chat se crea automáticamente gracias a @PrePersist en la entidad Ticket
        // ticket.ensureChatExists(); // No es necesario llamar explícitamente

        Ticket savedTicket = ticketRepository.save(ticket);
        logger.info("Ticket creado exitosamente con ID: {} y Código: {}", savedTicket.getId(), savedTicket.getCodigo());
        return ticketMapper.toDto(savedTicket);
    }

    /**
     * Valida los campos obligatorios del {@link TicketDto} para la creación de un ticket.
     *
     * @param dto El DTO a validar.
     * @throws ResourceNotFoundException Si alguna validación falla.
     */
    private void validateTicketDtoForCreation(TicketDto dto) {
        Objects.requireNonNull(dto, "El DTO del ticket no puede ser nulo.");
        if (!StringUtils.hasText(dto.getTema())) {
            throw new ResourceNotFoundException("El tema del ticket es obligatorio.");
        }
        if (!StringUtils.hasText(dto.getDescripcion())) {
            throw new ResourceNotFoundException("La descripción del ticket es obligatoria.");
        }
        if (dto.getUsuarioCreador() == null) {
            throw new ResourceNotFoundException("El ID del usuario creador es obligatorio.");
        }
        if (dto.getDepartamento() == null) {
            throw new ResourceNotFoundException("El ID del departamento es obligatorio.");
        }
        if (dto.getIncidencia() == null) {
            throw new ResourceNotFoundException("El ID de la incidencia es obligatorio.");
        }
        if (dto.getPrioridad() == null) {
            throw new ResourceNotFoundException("El ID de la prioridad es obligatorio.");
        }
        if (dto.getEstado() == null) {
            throw new ResourceNotFoundException("El ID del estado es obligatorio.");
        }
        if (dto.getFuente() == null) { // Asumiendo que fuente y motivo también son obligatorios
            throw new ResourceNotFoundException("El ID de la fuente es obligatorio.");
        }
        if (dto.getMotivo() == null) {
            throw new ResourceNotFoundException("El ID del motivo es obligatorio.");
        }
        // Añadir más validaciones según sea necesario (ej. formato de fechaVencimiento)
    }


    /**
     * Establece las relaciones de la entidad {@link Ticket} con otras entidades
     * basándose en los IDs proporcionados en el {@link TicketDto}.
     *
     * @param ticket La entidad Ticket cuyas relaciones se van a establecer.
     * @param dto El TicketDto que contiene los IDs de las entidades relacionadas.
     * @throws ResourceNotFoundException Si alguna entidad referenciada no se encuentra.
     */
    private void setTicketRelationships(Ticket ticket, TicketDto dto) {
        // Usuario Creador (Obligatorio)
        ticket.setUsuarioCreador(usuarioRepository.findById(dto.getUsuarioCreador())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario creador no encontrado con ID: " + dto.getUsuarioCreador())));

        // Usuario Asignado (Opcional)
        if (dto.getUsuarioAsignado() != null) {
            ticket.setUsuarioAsignado(usuarioRepository.findById(dto.getUsuarioAsignado())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario asignado no encontrado con ID: " + dto.getUsuarioAsignado())));
        } else {
            ticket.setUsuarioAsignado(null); // Asegurar que sea null si no se proporciona
        }

        // Departamento (Obligatorio)
        ticket.setDepartamento(departamentoRepository.findById(dto.getDepartamento())
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + dto.getDepartamento())));

        // Fuente (Asumiendo Obligatorio)
        ticket.setFuente(fuenteRepository.findById(dto.getFuente())
                .orElseThrow(() -> new ResourceNotFoundException("Fuente no encontrada con ID: " + dto.getFuente())));

        // Incidencia (Obligatoria)
        Incidencia incidencia = incidenciaRepository.findById(dto.getIncidencia())
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con ID: " + dto.getIncidencia()));
        // Validar que la incidencia pertenezca al departamento seleccionado
        if (!incidencia.getDepartamento().getId().equals(ticket.getDepartamento().getId())) {
            throw new ResourceNotFoundException(
                    String.format("La incidencia '%s' (ID: %d) no pertenece al departamento '%s' (ID: %d).",
                            incidencia.getNombre(), incidencia.getId(),
                            ticket.getDepartamento().getNombre(), ticket.getDepartamento().getId())
            );
        }
        ticket.setIncidencia(incidencia);


        // Motivo (Asumiendo Obligatorio)
        ticket.setMotivo(motivoRepository.findById(dto.getMotivo())
                .orElseThrow(() -> new ResourceNotFoundException("Motivo no encontrado con ID: " + dto.getMotivo())));

        // Prioridad (Obligatoria)
        ticket.setPrioridad(prioridadRepository.findById(dto.getPrioridad())
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada con ID: " + dto.getPrioridad())));

        // Estado (Obligatorio)
        ticket.setEstado(estadoRepository.findById(dto.getEstado())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado con ID: " + dto.getEstado())));
    }


    /**
     * Actualiza un ticket existente con la información del DTO proporcionado.
     * Ciertos campos como 'codigo', 'usuarioCreador', 'fechaCreacion' no se actualizan.
     *
     * @param id El ID del ticket a actualizar.
     * @param dto El {@link TicketDto} con los datos actualizados.
     * @return El {@link TicketDto} del ticket actualizado.
     * @throws ResourceNotFoundException Si el ticket con el ID dado no se encuentra.
     * @throws ResourceNotFoundException Si la información del DTO es inválida para la actualización.
     */
    @Override
    @Transactional
    public TicketDto updateTicket(Long id, TicketDto dto) {
        logger.info("Iniciando actualización de ticket con ID: {} y DTO: {}", id, dto);
        Objects.requireNonNull(dto, "El DTO del ticket no puede ser nulo para la actualización.");

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con ID para actualizar: " + id));

        // Validar campos actualizables
        if (!StringUtils.hasText(dto.getTema())) {
            throw new ResourceNotFoundException("El tema del ticket es obligatorio para la actualización.");
        }
        if (!StringUtils.hasText(dto.getDescripcion())) {
            throw new ResourceNotFoundException("La descripción del ticket es obligatoria para la actualización.");
        }
        // No permitir cambiar isTrashed directamente aquí, usar métodos específicos deleteTicket/restoreTicket

        // Actualizar campos directos del ticket
        ticket.setTema(dto.getTema());
        ticket.setDescripcion(dto.getDescripcion());
        ticket.setFechaVencimiento(dto.getFechaVencimiento());
        ticket.setFechaActualizacion(LocalDateTime.now()); // Se actualiza automáticamente por @UpdateTimestamp

        // Actualizar relaciones (similar a la creación, pero con validaciones adicionales si es necesario)
        // No se permite cambiar el usuario creador.
        // El código del ticket no debería cambiar.

        // Usuario Asignado (Opcional)
        if (dto.getUsuarioAsignado() != null) {
            if (ticket.getUsuarioAsignado() == null || !dto.getUsuarioAsignado().equals(ticket.getUsuarioAsignado().getId())) {
                ticket.setUsuarioAsignado(usuarioRepository.findById(dto.getUsuarioAsignado())
                        .orElseThrow(() -> new ResourceNotFoundException("Usuario asignado no encontrado con ID: " + dto.getUsuarioAsignado())));
            }
        }

        // Departamento
        if (dto.getDepartamento() != null && (ticket.getDepartamento() == null || !dto.getDepartamento().equals(ticket.getDepartamento().getId()))) {
            ticket.setDepartamento(departamentoRepository.findById(dto.getDepartamento())
                    .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con ID: " + dto.getDepartamento())));
            // Si cambia el departamento, la incidencia actual podría ser inválida.
            // Forzar la re-selección de la incidencia o validar.
            if (dto.getIncidencia() == null) {
                throw new ResourceNotFoundException("Si se cambia el departamento, se debe especificar una nueva incidencia válida para ese departamento.");
            }
        }

        // Incidencia
        if (dto.getIncidencia() != null && (ticket.getIncidencia() == null || !dto.getIncidencia().equals(ticket.getIncidencia().getId()))) {
            Incidencia nuevaIncidencia = incidenciaRepository.findById(dto.getIncidencia())
                    .orElseThrow(() -> new ResourceNotFoundException("Incidencia no encontrada con ID: " + dto.getIncidencia()));
            // Validar que la nueva incidencia pertenezca al departamento actual (o nuevo) del ticket
            if (!nuevaIncidencia.getDepartamento().getId().equals(ticket.getDepartamento().getId())) {
                throw new ResourceNotFoundException(
                        String.format("La nueva incidencia '%s' no pertenece al departamento '%s' del ticket.",
                                nuevaIncidencia.getNombre(), ticket.getDepartamento().getNombre())
                );
            }
            ticket.setIncidencia(nuevaIncidencia);
        } else if (dto.getDepartamento() != null && dto.getIncidencia() == null) {
            // Si se cambió el departamento pero no se especificó una nueva incidencia.
            throw new ResourceNotFoundException("Se requiere una incidencia al cambiar el departamento.");
        }


        // Fuente
        if (dto.getFuente() != null && (ticket.getFuente() == null || !dto.getFuente().equals(ticket.getFuente().getId()))) {
            ticket.setFuente(fuenteRepository.findById(dto.getFuente())
                    .orElseThrow(() -> new ResourceNotFoundException("Fuente no encontrada con ID: " + dto.getFuente())));
        }

        // Motivo
        if (dto.getMotivo() != null && (ticket.getMotivo() == null || !dto.getMotivo().equals(ticket.getMotivo().getId()))) {
            ticket.setMotivo(motivoRepository.findById(dto.getMotivo())
                    .orElseThrow(() -> new ResourceNotFoundException("Motivo no encontrado con ID: " + dto.getMotivo())));
        }

        // Prioridad
        if (dto.getPrioridad() != null && (ticket.getPrioridad() == null || !dto.getPrioridad().equals(ticket.getPrioridad().getId()))) {
            ticket.setPrioridad(prioridadRepository.findById(dto.getPrioridad())
                    .orElseThrow(() -> new ResourceNotFoundException("Prioridad no encontrada con ID: " + dto.getPrioridad())));
        }

        // Estado
        if (dto.getEstado() != null && (ticket.getEstado() == null || !dto.getEstado().equals(ticket.getEstado().getId()))) {
            ticket.setEstado(estadoRepository.findById(dto.getEstado())
                    .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado con ID: " + dto.getEstado())));
        }


        Ticket updatedTicket = ticketRepository.save(ticket);
        logger.info("Ticket con ID: {} actualizado exitosamente.", updatedTicket.getId());
        return ticketMapper.toDto(updatedTicket);
    }

    @Override
    public TicketDto updateStatus(Long id, Long estadoId) {
        Ticket updatedTicket = ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado con ID: " + id));
        updatedTicket.setEstado(estadoRepository.findById(estadoId).orElseThrow());
        updatedTicket = ticketRepository.save(updatedTicket);
        return ticketMapper.toDto(updatedTicket);
    }

    // --- Métodos de consulta y eliminación (con documentación añadida) ---

    /**
     * Obtiene todos los tickets activos (no en la papelera), paginados.
     * Puede filtrar por nombre de departamento si se proporciona.
     *
     * @param pageable Información de paginación y ordenamiento.
     * @param departamentoNombre Nombre del departamento para filtrar (opcional).
     * @return Una página de {@link TicketDto}.
     */
    @Override
    public Page<TicketDto> getAllTickets(Pageable pageable, String departamentoNombre) {
        Page<Ticket> ticketsPage;
        if (StringUtils.hasText(departamentoNombre)) {
            ticketsPage = ticketRepository.findAllByDepartamentoNombreAndIsTrashedFalse(departamentoNombre, pageable);
            return ticketsPage.map(ticketMapper::toDto);
        }
        ticketsPage = ticketRepository.findAllByIsTrashedFalse(pageable);
        return ticketsPage.map(ticketMapper::toDto);
    }

    @Override
    public Page<TicketDto> GetTicketsDashboard(Pageable pageable,Long id, String departamentoNombre) {
        Page<Ticket> ticketsPage;
        if (StringUtils.hasText((departamentoNombre))) {
            ticketsPage = ticketRepository.findAllByUsuarioCreadorIdAndDepartamentoNombre(pageable,id,departamentoNombre);
            return ticketsPage.map(ticketMapper::toDto);
        }
        ticketsPage = ticketRepository.findAllByUsuarioCreadorId(pageable,id);
        return ticketsPage.map(ticketMapper::toDto);
    }
    @Override
    public Page<TicketDto> GetTicketsByUsuario(Pageable pageable,Long id, String departamentoNombre) {
        Page<Ticket> ticketsPage;
        if (StringUtils.hasText((departamentoNombre))) {
            ticketsPage = ticketRepository.findAllByUsuarioAsignadoIdAndDepartamentoNombre(pageable,id,departamentoNombre);
            return ticketsPage.map(ticketMapper::toDto);
        }
        ticketsPage = ticketRepository.findAllByUsuarioAsignadoId(pageable,id);
        return ticketsPage.map(ticketMapper::toDto);
    }

    /**
     * Obtiene tickets activos (no en la papelera) filtrados por estado y opcionalmente por departamento.
     *
     * @param pageable Información de paginación y ordenamiento.
     * @param estadoNombre Nombre del estado para filtrar (obligatorio si no se filtra por departamento).
     * @param departamentoNombre Nombre del departamento para filtrar (opcional).
     * @return Una página de {@link TicketDto}.
     */
    @Override
    public Page<TicketDto> getTickets(Pageable pageable, String estadoNombre, String departamentoNombre) {
        logger.debug("Obteniendo tickets. Pageable: {}, Estado: {}, Departamento: {}", pageable, estadoNombre, departamentoNombre);
        Page<Ticket> ticketsPage;
        if (!StringUtils.hasText(estadoNombre)) {
            // Si no hay filtro de estado, podría devolver todos los activos o lanzar error.
            // Por ahora, se asume que si estadoNombre es null, se usa el comportamiento de getAllTickets.
            // O podrías lanzar: throw new ResourceNotFoundException("El filtro por nombre de estado es requerido si no se especifica departamento.");
            return getAllTickets(pageable, departamentoNombre);
        }

        if (StringUtils.hasText(departamentoNombre)) {
            ticketsPage = ticketRepository.findAllByEstadoNombreAndDepartamentoNombreAndIsTrashedFalse(estadoNombre, departamentoNombre, pageable);
        } else {
            ticketsPage = ticketRepository.findAllByEstadoNombreAndIsTrashedFalse(estadoNombre, pageable);
        }
        return ticketsPage.map(ticketMapper::toDto);
    }

    /**
     * Obtiene todos los tickets que están en la papelera (isTrashed = true), paginados.
     *
     * @param pageable Información de paginación y ordenamiento.
     * @param filtro No utilizado actualmente en la implementación, pero presente en la firma.
     * @return Una página de {@link TicketDto} de tickets en la papelera.
     */
    @Override
    public Page<TicketDto> getAllTrashedTickets(Pageable pageable, String filtro) {
        // El parámetro 'filtro' no se usa actualmente en la lógica del repositorio.
        // Considerar si se necesita o se puede eliminar de la firma.
        logger.debug("Obteniendo tickets en la papelera. Pageable: {}", pageable);
        Page<Ticket> ticketsPage = ticketRepository.findAllByIsTrashedTrue(pageable);
        return ticketsPage.map(ticketMapper::toDto);
    }

    @Override
    public Page<TicketDto> getTicketsByTema(Pageable pageable, String busqueda) {
        logger.debug("Obteniendo tickets por tema. Pageable: {}, Busqueda: {}", pageable, busqueda);
        Page<Ticket> ticketsPage = ticketRepository.findAllByTemaContainsIgnoreCaseAndIsTrashedFalseOrCodigoContainsIgnoreCaseAndIsTrashedFalse(busqueda,busqueda, pageable);
        return ticketsPage.map(ticketMapper::toDto);
    }

    /**
     * Obtiene un ticket específico por su ID.
     *
     * @param id El ID del ticket a obtener.
     * @return El {@link TicketDto} correspondiente.
     * @throws ResourceNotFoundException Si no se encuentra ningún ticket con el ID proporcionado.
     */
    @Override
    public TicketDto getTicketById(Long id) {
        logger.debug("Obteniendo ticket por ID: {}", id);
        return ticketRepository.findById(id)
                .map(ticketMapper::toDto)
                .orElseThrow(() -> {
                    logger.warn("Ticket no encontrado con ID: {}", id);
                    return new ResourceNotFoundException("Ticket no encontrado con ID: " + id);
                });
    }

    /**
     * Marca un ticket como "en la papelera" (soft delete).
     * No elimina el registro de la base de datos.
     *
     * @param id El ID del ticket a eliminar lógicamente.
     * @throws ResourceNotFoundException Si el ticket no se encuentra.
     */
    @Override
    @Transactional
    public void deleteTicket(Long id) {
        logger.info("Marcando ticket con ID: {} como eliminado (en papelera).", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado para eliminar con ID: " + id));

        if (ticket.getIsTrashed()) {
            logger.warn("El ticket con ID: {} ya está en la papelera.", id);
            // Podrías lanzar una BusinessException o simplemente no hacer nada.
            // throw new BusinessException("El ticket ya está en la papelera.");
            return;
        }
        ticket.setIsTrashed(true);
        // ticket.setFechaActualizacion(LocalDateTime.now()); // Se actualiza automáticamente
        ticketRepository.save(ticket);
        logger.info("Ticket con ID: {} movido a la papelera.", id);
    }

    /**
     * Restaura un ticket que estaba en la papelera, marcándolo como activo.
     *
     * @param id El ID del ticket a restaurar.
     * @throws ResourceNotFoundException Si el ticket no se encuentra.
     */
    @Override
    @Transactional
    public void restoreTicket(Long id) {
        logger.info("Restaurando ticket con ID: {} desde la papelera.", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado para restaurar con ID: " + id));

        if (!ticket.getIsTrashed()) {
            logger.warn("El ticket con ID: {} no está en la papelera, no se puede restaurar.", id);
            // throw new BusinessException("El ticket no está en la papelera.");
            return;
        }
        ticket.setIsTrashed(false);
        // ticket.setFechaActualizacion(LocalDateTime.now()); // Se actualiza automáticamente
        ticketRepository.save(ticket);
        logger.info("Ticket con ID: {} restaurado.", id);
    }


    // --- Generación de Código (Mantenido como estaba, con logging añadido) ---

    /**
     * Genera el siguiente código secuencial para un ticket.
     * Formato: ATN-XX-NNNN donde XX son letras y NNNN son números.
     *
     * @return El siguiente código de ticket generado.
     * @throws IllegalStateException Si el formato del código existente es inválido o se alcanza el límite.
     */
    private String generateNextCodigo() {
        String maxCodigo = ticketRepository.findMaxCodigo();
        logger.debug("Último código máximo encontrado: {}", maxCodigo);

        if (maxCodigo == null) {
            logger.info("No se encontró código previo, generando el primero: ATN-AA-0001");
            return "ATN-AA-0001";
        }

        String[] parts = maxCodigo.split("-");
        if (parts.length != 3 || !parts[0].equals("ATN")) {
            logger.error("Formato de código inválido encontrado en la base de datos: {}", maxCodigo);
            throw new IllegalStateException("Formato de código inválido en la base de datos: " + maxCodigo);
        }

        String letras = parts[1];
        int numero;
        try {
            numero = Integer.parseInt(parts[2]);
        } catch (NumberFormatException e) {
            logger.error("Parte numérica del código inválida: {} en código {}", parts[2], maxCodigo, e);
            throw new IllegalStateException("Parte numérica del código inválida: " + parts[2], e);
        }


        if (numero < 9999) {
            numero++;
        } else {
            letras = incrementarLetras(letras);
            numero = 1;
        }

        String nuevoCodigo = String.format("ATN-%s-%04d", letras, numero);
        logger.info("Nuevo código generado: {}", nuevoCodigo);
        return nuevoCodigo;
    }

    private String incrementarLetras(String letras) {
        if (letras == null || letras.length() != 2) {
            logger.error("Formato de letras inválido para incrementar: {}", letras);
            throw new IllegalArgumentException("El string de letras debe tener longitud 2.");
        }
        char[] chars = letras.toCharArray();

        // Incrementar la segunda letra
        chars[1]++;
        if (chars[1] > 'Z') {
            chars[1] = 'A'; // Reiniciar y llevar a la primera letra
            chars[0]++;
            if (chars[0] > 'Z') {
                // Límite alcanzado (ZZ)
                logger.error("Límite máximo de combinaciones de letras (ZZ) alcanzado.");
                throw new IllegalStateException("Límite máximo de códigos (ATN-ZZ-9999) alcanzado.");
            }
        }
        return new String(chars);
    }
}