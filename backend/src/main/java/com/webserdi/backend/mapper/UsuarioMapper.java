package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
@Component
public class UsuarioMapper {
    public static Usuario mapToUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioDto.getId());
        usuario.setEmail(usuarioDto.getEmail());
        usuario.setEnabled(usuarioDto.isEnabled());
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setApellido(usuarioDto.getApellido());
        // Los permisos se manejan en el servicio específico
        return usuario;
    }

    public static UsuarioDto mapToUsuarioDto(Usuario usuario) {
        UsuarioDto usuarioDto = new UsuarioDto();
        usuarioDto.setId(usuario.getId());
        usuarioDto.setEmail(usuario.getEmail());
        usuarioDto.setEnabled(usuario.isEnabled());
        usuarioDto.setNombre(usuario.getNombre());
        usuarioDto.setApellido(usuario.getApellido());
        usuarioDto.setRoles(usuario.getRoles().stream()
                .map(Rol::getNombre)
                .collect(Collectors.toSet()));
        usuarioDto.setPermisos(usuario.getPermisos().stream()
                .map(Permiso::getNombre)
                .collect(Collectors.toSet()));

        return usuarioDto;
    }

}