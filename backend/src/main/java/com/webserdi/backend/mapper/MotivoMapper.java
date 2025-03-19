package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.MotivoDto;
import com.webserdi.backend.entity.Motivo;
import org.springframework.stereotype.Component;

@Component
public class MotivoMapper {

    public Motivo toEntity(MotivoDto motivoDto) {
        Motivo motivo = new Motivo();
        motivo.setId(motivoDto.getId());
        motivo.setNombre(motivoDto.getNombre());
        return motivo;
    }

    public MotivoDto toDto(Motivo motivo) {
        MotivoDto motivoDto = new MotivoDto();
        motivoDto.setId(motivo.getId());
        motivoDto.setNombre(motivo.getNombre());
        return motivoDto;
    }
}