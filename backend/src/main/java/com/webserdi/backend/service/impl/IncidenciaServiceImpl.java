package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.IncidenciaDto;
import com.webserdi.backend.entity.Incidencia;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.FuenteMapper;
import com.webserdi.backend.mapper.IncidenciaMapper;
import com.webserdi.backend.repository.IncidenciaRepository;
import com.webserdi.backend.service.IncidenciaService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class IncidenciaServiceImpl implements IncidenciaService {
    private final IncidenciaMapper incidenciaMapper;
    private final IncidenciaRepository incidenciaRepository;
    private final FuenteMapper fuenteMapper;

    @Override
    public IncidenciaDto createIncidencia(IncidenciaDto incidenciaDto) {
        Incidencia incidencia = incidenciaMapper.toEntity(incidenciaDto);
        incidenciaRepository.save(incidencia);
        return incidenciaMapper.toDto(incidenciaMapper.toEntity(incidenciaDto));
    }

    @Override
    public IncidenciaDto getIncidenciaById(Long incidenciaId) {
        Incidencia incidencia = incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia not found with id: " + incidenciaId));
        return incidenciaMapper.toDto(incidencia);
    }

    @Override
    public List<IncidenciaDto> getAllIncidencias() {
        return incidenciaRepository.findAll().stream()
                .map(incidenciaMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public IncidenciaDto updateIncidencia(Long incidenciaId, IncidenciaDto incidenciaDto) {
        Incidencia incidencia = incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia not found with id: " + incidenciaId));
        incidencia.setNombre(incidenciaDto.getNombre());
        incidenciaRepository.save(incidencia);
        return incidenciaMapper.toDto(incidencia);
    }

    @Override
    public void deleteIncidencia(Long incidenciaId) {
        Incidencia incidencia = incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Incidencia not found with id: " + incidenciaId));
        incidenciaRepository.delete(incidencia);
    }

}
