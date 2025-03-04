package com.webserdi.backend.service;

import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.dto.UsuarioPermisoDto;

import java.util.List;

public interface UsuarioService {
    UsuarioDto createUsuario(UsuarioDto usuarioDto);
    UsuarioDto getUsuarioById(Long usuarioId);
    List<UsuarioDto> getAllUsuarios();
    //List<UsuarioDto> getAllUsuariosWithRoleName();
    UsuarioDto updateUsuario(Long usuarioId,UsuarioDto usuarioDto);
    void deleteUsuario(Long usuarioId);
}
