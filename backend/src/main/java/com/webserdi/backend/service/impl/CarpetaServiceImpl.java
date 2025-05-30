package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.CarpetaDto;
import com.webserdi.backend.repository.CarpetaRepository;
import com.webserdi.backend.service.CarpetaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class CarpetaServiceImpl implements CarpetaService {

    private final CarpetaRepository carpetaRepository;


    @Override
    public CarpetaDto createCarpeta(CarpetaDto carpetaDto) {
        return null;
    }

    @Override
    public CarpetaDto getCarpetaById(Long carpetaId) {
        return null;
    }

    @Override
    public List<CarpetaDto> getAllCarpetas() {
        return List.of();
    }

    @Override
    public CarpetaDto updateCarpeta(Long carpetaId, CarpetaDto carpetaDto) {
        return null;
    }

    @Override
    public void deleteCarpeta(Long carpetaId) {

    }
}
