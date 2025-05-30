package com.webserdi.backend.service;

import com.webserdi.backend.dto.CarpetaDto;

import java.util.List;

public interface CarpetaService {
    CarpetaDto createCarpeta(CarpetaDto carpetaDto);
    CarpetaDto getCarpetaById(Long carpetaId);
    List<CarpetaDto> getAllCarpetas();
    CarpetaDto updateCarpeta(Long carpetaId, CarpetaDto carpetaDto);
    void deleteCarpeta(Long carpetaId);
}
