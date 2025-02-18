package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Usuario;


public class UsuarioMapper {
    public static Usuario mapToUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioDto.getId());
        usuario.setEmail(usuarioDto.getEmail());
        usuario.setNombre(usuarioDto.getNombre());
        usuario.setApellido(usuarioDto.getApellido());
        return usuario;
    }

    public static UsuarioDto mapToUsuarioDto(Usuario usuario) {
        UsuarioDto usuarioDto = new UsuarioDto();
        usuarioDto.setId(usuario.getId());
        usuarioDto.setEmail(usuario.getEmail());
        usuarioDto.setNombre(usuario.getNombre());
        usuarioDto.setApellido(usuario.getApellido());
        usuarioDto.setRolId(usuario.getRol().getId());
        return usuarioDto;
    }

}
