package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.CarpetaDto;
import com.webserdi.backend.entity.Carpeta;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.CarpetaMapper;
import com.webserdi.backend.repository.CarpetaRepository;
import com.webserdi.backend.service.CarpetaService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class CarpetaServiceImpl implements CarpetaService {

    private final CarpetaRepository carpetaRepository;
    private final CarpetaMapper carpetaMapper;

    @Override
    public CarpetaDto createCarpeta(CarpetaDto carpetaDto) {
        Carpeta carpeta = carpetaMapper.toEntity(carpetaDto);

        // Aquí se resuelve la carpeta padre si se proporcionó el ID
        if (carpetaDto.getCarpetaPadreId() != null) {
            Carpeta carpetaPadre = carpetaRepository.findById(carpetaDto.getCarpetaPadreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Carpeta padre no encontrada con ID: " + carpetaDto.getCarpetaPadreId()));
            carpeta.setCarpetaPadre(carpetaPadre);
        }

        carpeta = carpetaRepository.save(carpeta);
        return carpetaMapper.toDto(carpeta);
    }

    @Override
    public CarpetaDto getCarpetaById(Long carpetaId) {
        Carpeta carpeta = carpetaRepository.findById(carpetaId)
                .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada con ID:" + carpetaId));
        return carpetaMapper.toDto(carpeta);
    }

    @Override
    public List<CarpetaDto> getAllCarpetas() {
        return carpetaRepository.findAll().stream()
                .map(carpetaMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CarpetaDto updateCarpeta(Long carpetaId, CarpetaDto carpetaDto) {
        Carpeta carpeta = carpetaRepository.findById(carpetaId)
                .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada con id" + carpetaId));
        carpeta.setNombre(carpetaDto.getNombre());
        carpeta = carpetaRepository.save(carpeta);
        return carpetaMapper.toDto(carpeta);
    }

    @Override
    public void deleteCarpeta(Long carpetaId) {
        Carpeta carpeta = carpetaRepository.findById(carpetaId)
                .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada con id" + carpetaId));
        carpetaRepository.delete(carpeta);
    }
}
