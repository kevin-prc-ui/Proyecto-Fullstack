package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.IncidenciaDto;
import com.webserdi.backend.entity.Incidencia;
import org.springframework.stereotype.Component;

@Component
public class IncidenciaMapper {
    public Incidencia toEntity(IncidenciaDto incidenciaDto){
        Incidencia incidencia = new Incidencia();
        incidencia.setId(incidenciaDto.getId());
        incidencia.setNombre(incidenciaDto.getNombre());
        return incidencia;
    }
    public IncidenciaDto toDto(Incidencia incidencia){
        IncidenciaDto dto = new IncidenciaDto();
        dto.setId(incidencia.getId());
        dto.setNombre(incidencia.getNombre());
        return dto;
    }
}
