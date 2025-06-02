package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.ArchivoDto;
import com.webserdi.backend.entity.Archivo;
import com.webserdi.backend.entity.Carpeta;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.ArchivoMapper;
import com.webserdi.backend.repository.ArchivoRepository;
import com.webserdi.backend.repository.CarpetaRepository;
import com.webserdi.backend.service.ArchivoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ArchivoServiceImpl implements ArchivoService {

    private final ArchivoRepository archivoRepository;
    private final ArchivoMapper archivoMapper;
    private final CarpetaRepository carpetaRepository;

    @Override
    public ArchivoDto createArchivo(ArchivoDto archivoDto) {
        if (archivoDto == null) {
            throw new ResourceNotFoundException("El DTO del archivo no puede ser nulo.");
        }
        if (archivoDto.getNombre() == null || archivoDto.getNombre().isBlank()) {
            throw new ResourceNotFoundException("El nombre del archivo es obligatorio.");
        }
        if (archivoDto.getCarpetaId() == null) {
            throw new ResourceNotFoundException("El ID de la carpeta es obligatorio para crear un archivo.");
        }

        Carpeta carpeta = carpetaRepository.findById(archivoDto.getCarpetaId())
                .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada con id: " + archivoDto.getCarpetaId()));

        Archivo archivo = archivoMapper.toEntity(archivoDto);
        archivo.setCarpeta(carpeta); // asignar carpeta encontrada
        archivo = archivoRepository.save(archivo);

        return archivoMapper.toDto(archivo);
    }

    @Override
    public ArchivoDto getArchivoById(Long archivoId) {
        Archivo archivo = archivoRepository.findById(archivoId)
                .orElseThrow(() -> new ResourceNotFoundException("Archivo no encontrado con id: " + archivoId));
        return archivoMapper.toDto(archivo);
    }

    @Override
    public List<ArchivoDto> getAllArchivos() {
        return archivoRepository.findAll().stream()
                .map(archivoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ArchivoDto updateArchivo(Long archivoId, ArchivoDto archivoDto) {
        Archivo archivo = archivoRepository.findById(archivoId)
                .orElseThrow(() -> new ResourceNotFoundException("Archivo no encontrado con id: " + archivoId));

        if (archivoDto.getNombre() == null || archivoDto.getNombre().isBlank()) {
            throw new ResourceNotFoundException("El nombre del archivo no puede estar vacío.");
        }

        archivo.setNombre(archivoDto.getNombre().trim());

        // Actualiza la carpeta si se proporciona una diferente
        if (archivoDto.getCarpetaId() != null && !archivoDto.getCarpetaId().equals(archivo.getCarpeta().getId())) {
            Carpeta nuevaCarpeta = carpetaRepository.findById(archivoDto.getCarpetaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Carpeta no encontrada con id: " + archivoDto.getCarpetaId()));
            archivo.setCarpeta(nuevaCarpeta);
        }

        archivo = archivoRepository.save(archivo);
        return archivoMapper.toDto(archivo);
    }

    @Override
    public void deleteArchivo(Long archivoId) {
        Archivo archivo = archivoRepository.findById(archivoId)
                .orElseThrow(() -> new ResourceNotFoundException("Archivo no encontrado con id: " + archivoId));
        archivoRepository.delete(archivo);
    }
}
