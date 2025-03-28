package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.MotivoDto;
import com.webserdi.backend.entity.Motivo;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.MotivoMapper;
import com.webserdi.backend.repository.MotivoRepository;
import com.webserdi.backend.service.MotivoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class MotivoServiceImpl implements MotivoService {

    private final MotivoRepository motivoRepository;
    private final MotivoMapper motivoMapper;

    @Override
    public MotivoDto createMotivo(MotivoDto motivoDto) {
        Motivo motivo = motivoMapper.toEntity(motivoDto);
        motivo = motivoRepository.save(motivo);
        return motivoMapper.toDto(motivo);
    }

    @Override
    public MotivoDto getMotivoById(Long motivoId) {
        Motivo motivo = motivoRepository.findById(motivoId)
                .orElseThrow(() -> new ResourceNotFoundException("Motivo not found with id: " + motivoId));
        return motivoMapper.toDto(motivo);
    }

    @Override
    public List<MotivoDto> getAllMotivos() {
        return motivoRepository.findAll().stream()
                .map(motivoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MotivoDto updateMotivo(Long motivoId, MotivoDto motivoDto) {
        Motivo motivo = motivoRepository.findById(motivoId)
                .orElseThrow(() -> new ResourceNotFoundException("Motivo not found with id: " + motivoId));
        motivo.setNombre(motivoDto.getNombre());
        motivo = motivoRepository.save(motivo);
        return motivoMapper.toDto(motivo);
    }

    @Override
    public void deleteMotivo(Long motivoId) {
        Motivo motivo = motivoRepository.findById(motivoId)
                .orElseThrow(() -> new ResourceNotFoundException("Motivo not found with id: " + motivoId));
        motivoRepository.delete(motivo);
    }
}