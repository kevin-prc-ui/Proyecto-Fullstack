package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.SitioDto;
import com.webserdi.backend.entity.Sitio;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.repository.UsuarioRepository;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

public class SitioMapper {

    public static Sitio toEntity(SitioDto dto, Usuario creador, UsuarioRepository usuarioRepo) {
        Sitio sitio = new Sitio();
        sitio.setNombre(dto.getName());
        sitio.setDescripcion(dto.getDescription());
        sitio.setTipo(dto.getType());
        sitio.setVisibilidad(dto.getVisibility());
        sitio.setSlug(dto.getSiteId());
        sitio.setCreador(creador);

        if (dto.getUsuariosAsignados() != null) {
            List<Usuario> usuarios = usuarioRepo.findAllById(dto.getUsuariosAsignados());
            sitio.setUsuarios(usuarios);
        }

        sitio.setAdministradores(new HashSet<>()); // opcional: puedes usar dto para asignarlos
        return sitio;
    }

    public static SitioDto toDto(Sitio sitio) {
        SitioDto dto = new SitioDto();
        dto.setId(sitio.getId());
        dto.setName(sitio.getNombre());
        dto.setDescription(sitio.getDescripcion());
        dto.setType(sitio.getTipo());
        dto.setVisibility(sitio.getVisibilidad());
        dto.setSiteId(sitio.getSlug());
        dto.setCreadorId(sitio.getCreador().getId());

        if (sitio.getUsuarios() != null) {
            dto.setUsuariosAsignados(sitio.getUsuarios().stream()
                    .map(Usuario::getId)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}
