package com.webserdi.backend.service;

import com.webserdi.backend.dto.MotivoDto;

import java.util.List;

public interface MotivoService {
    MotivoDto createMotivo(MotivoDto motivoDto);
    MotivoDto getMotivoById(Long motivoId);
    List<MotivoDto> getAllMotivos();
    MotivoDto updateMotivo(Long motivoId, MotivoDto motivoDto);
    void deleteMotivo(Long motivoId);
}