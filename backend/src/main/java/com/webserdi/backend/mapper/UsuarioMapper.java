package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.DepartamentoDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Departamento;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
@Component
public class UsuarioMapper {

    public static UsuarioDto mapToUsuarioDto(Usuario usuario) {
        UsuarioDto usuarioDto = new UsuarioDto();
        usuarioDto.setId(usuario.getId());
        usuarioDto.setEmail(usuario.getEmail());
        usuarioDto.setEnabled(usuario.isEnabled());
        usuarioDto.setNombre(usuario.getNombre());
        usuarioDto.setApellido(usuario.getApellido());
        // Mapear el departamento asociado
        Departamento departamentoEntity = usuario.getDepartamento();
        if (departamentoEntity != null) {
            DepartamentoDto departamentoDto = new DepartamentoDto();
            departamentoDto.setId(departamentoEntity.getId());
            departamentoDto.setNombre(departamentoEntity.getNombre());
            usuarioDto.setDepartamento(departamentoDto); // <-- Establecer el DTO anidado
        }
        // Si departamentoEntity es null, dto.getDepartamento() permanecerá null
        usuarioDto.setRoles(usuario.getRoles().stream()
                .map(Rol::getNombre)
                .collect(Collectors.toSet()));
        usuarioDto.setPermisos(usuario.getPermisos().stream()
                .map(Permiso::getNombre)
                .collect(Collectors.toSet()));

        return usuarioDto;
    }

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


}