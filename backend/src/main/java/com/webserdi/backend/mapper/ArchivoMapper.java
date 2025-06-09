package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.ArchivoDto;
import com.webserdi.backend.entity.Archivo;
import org.springframework.stereotype.Component;

@Component
public class ArchivoMapper {
    public Archivo toEntity(ArchivoDto archivoDto) {
        Archivo archivo = new com.webserdi.backend.entity.Archivo();
        archivo.setId(archivoDto.getId());
        archivo.setNombre(archivoDto.getNombre());
        archivo.setTipo(archivoDto.getTipo());
        archivo.setTamaño(archivoDto.getTamaño());
        archivo.setFechaSubida(archivoDto.getFechaSubida());
        // La carpeta debe ser manejada por el servicio, no el mapper
        return archivo;
    }

    public ArchivoDto toDto(Archivo archivo) {
        ArchivoDto archivoDto = new ArchivoDto();
        archivoDto.setId(archivo.getId());
        archivoDto.setNombre(archivo.getNombre());
        archivoDto.setTipo(archivo.getTipo());
        archivoDto.setTamaño(archivo.getTamaño());
        archivoDto.setFechaSubida(archivo.getFechaSubida());

        if (archivo.getCarpeta() != null) {
            archivoDto.setCarpetaId(archivo.getCarpeta().getId());
        }

        if (archivo.getUsuario() != null) {
            archivoDto.setUsuarioId(archivo.getUsuario().getId());
        }

        return archivoDto;
    }
}
