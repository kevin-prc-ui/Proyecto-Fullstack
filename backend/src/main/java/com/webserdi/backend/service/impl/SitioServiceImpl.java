package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.SitioDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Sitio;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.SitioMapper;
import com.webserdi.backend.repository.SitioRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.SitioService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SitioServiceImpl implements SitioService {
    private final SitioMapper sitioMapper;
    private final SitioRepository sitioRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public SitioDto crearSitio(SitioDto sitioDto) {
        // 1. Validar unicidad del slug
        if (sitioRepository.existsBySlug(sitioDto.getSiteId())) {
            throw new RuntimeException("Ya existe un sitio con ese ID");
        }

        // 2. Obtener y validar usuario creador
        Usuario creador = usuarioRepository.findById(sitioDto.getCreadorId())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        // 3. Convertir DTO a entidad
        Sitio sitio = sitioMapper.toEntity(sitioDto);
        sitio.setCreador(creador);
        sitio.setSlug(sitioDto.getSiteId());

        // 4. Manejar usuarios asignados
        if (sitioDto.getUsuariosAsignados() != null && !sitioDto.getUsuariosAsignados().isEmpty()) {
            // Obtener IDs de los usuarios asignados
            Set<Long> usuariosIds = sitioDto.getUsuariosAsignados().stream()
                    .map(UsuarioDto::getId)
                    .collect(Collectors.toSet());

            // Buscar todos los usuarios
            Set<Usuario> usuarios = new HashSet<>(usuarioRepository.findAllById(usuariosIds));

            // Verificar que se encontraron todos los usuarios
            if (usuarios.size() != usuariosIds.size()) {
                throw new RuntimeException("Algunos usuarios asignados no fueron encontrados");
            }

            sitio.setUsuarios(usuarios);
        }

        // 5. Guardar y retornar
        Sitio guardado = sitioRepository.save(sitio);
        return sitioMapper.toDto(guardado);
    }

    @Override
    public List<SitioDto> listarSitiosPublicosYModerados() {
        return sitioRepository.findAll().stream()
                .filter(sitio -> sitio.getVisibilidad().equalsIgnoreCase("Public") ||
                        sitio.getVisibilidad().equalsIgnoreCase("Moderated"))
                .map(sitioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SitioDto> listarMisSitios(Long usuarioId) {
        return sitioRepository.findAll().stream()
                .filter(s -> s.getCreador().getId().equals(usuarioId))
                .map(sitioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SitioDto> obtenerPorSlug(Long id) {
        return sitioRepository.findAllByCreadorId(id).stream()
                .map(sitioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarSitio(Long id) {
        sitioRepository.deleteById(id);
    }

    @Override
    public SitioDto actualizarSitio(Long id, SitioDto sitioDto) {
        Sitio sitio = sitioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sitio no encontrado"));

        sitio.setNombre(sitioDto.getName());
        sitio.setDescripcion(sitioDto.getDescription());
        sitio.setVisibilidad(sitioDto.getVisibility());
        sitio.setTipo(sitioDto.getType());

        Sitio actualizado = sitioRepository.save(sitio);
        return sitioMapper.toDto(actualizado);
    }
}
