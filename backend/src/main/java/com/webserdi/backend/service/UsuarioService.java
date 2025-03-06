package com.webserdi.backend.service;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.UsuarioDto;

import java.util.List;

public interface UsuarioService {
    UsuarioDto createUsuario(UsuarioDto usuarioDto);
    UsuarioDto getUsuarioById(Long usuarioId);
    List<UsuarioDto> getAllUsuarios();
    List<PermisoDto> getAllPermisos();
    UsuarioDto updateUsuario(Long usuarioId,UsuarioDto usuarioDto);
    void deleteUsuario(Long usuarioId);

}
