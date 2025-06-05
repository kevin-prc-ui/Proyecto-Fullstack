package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.SitioDto;
import com.webserdi.backend.entity.Sitio;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.mapper.SitioMapper;
import com.webserdi.backend.repository.SitioRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.SitioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SitioServiceImpl implements SitioService {

    private final SitioRepository sitioRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public SitioDto crearSitio(SitioDto sitioDto) {
        if (sitioRepository.existsBySlug(sitioDto.getSiteId())) {
            throw new RuntimeException("Ya existe un sitio con ese ID");
        }

        Usuario creador = usuarioRepository.findById(sitioDto.getCreadorId())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        Sitio sitio = SitioMapper.toEntity(sitioDto, creador, usuarioRepository);
        sitio.setSlug(sitioDto.getSiteId());

        Sitio guardado = sitioRepository.save(sitio);
        return SitioMapper.toDto(guardado);
    }

    @Override
    public List<SitioDto> listarMisSitios(Long usuarioId) {
        return sitioRepository.findAll().stream()
                .filter(s -> s.getCreador().getId().equals(usuarioId))
                .map(SitioMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SitioDto obtenerPorSlug(String slug) {
        Sitio sitio = sitioRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Sitio no encontrado"));
        return SitioMapper.toDto(sitio);
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
        return SitioMapper.toDto(actualizado);
    }
}
