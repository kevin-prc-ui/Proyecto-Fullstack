package com.webserdi.backend.dto;

import com.webserdi.backend.entity.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data

public class TicketDto {
    private Long id;
    private Long chatId;
    private String tema;
    private String descripcion;
    private String codigo;
    private Boolean isTrashed;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private LocalDate fechaVencimiento;
    private Long usuarioCreador;
    private Long usuarioAsignado;
    private String usuarioCreadorNombres;
    private String usuarioAsignadoNombres;
    private String departamentoNombre;
    private String fuenteNombre;
    private String incidenciaNombre;
    private String motivoNombre;
    private String prioridadNombre;
    private String estadoNombre;
    private Long departamento;
    private Long fuente;
    private Long incidencia;
    private Long motivo;
    private Long prioridad;
    private Long estado;
}
