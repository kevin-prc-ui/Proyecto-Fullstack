package com.webserdi.backend.dto;

import lombok.Data;

@Data
public class ArchivoDto {
    private Long id;
    private String nombre;
    private String tipo;
    private Long tamaño;
    private String rutaAlmacenamiento;
    private java.time.LocalDateTime fechaSubida;
    private Long carpetaId; // ID de la carpeta a la que pertenece

}
