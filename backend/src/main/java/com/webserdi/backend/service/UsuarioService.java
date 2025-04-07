package com.webserdi.backend.service;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.RolDto;
import com.webserdi.backend.dto.UsuarioDto;

import java.util.List;
import java.util.Set;

public interface UsuarioService {

    UsuarioDto createUsuario(UsuarioDto usuarioDto);
    UsuarioDto getUsuarioById(Long usuarioId);
    List<UsuarioDto> getAllUsuarios();
    List<PermisoDto> getAllPermisos();
    UsuarioDto updateUsuario(Long usuarioId,UsuarioDto usuarioDto);
    void deleteUsuario(Long usuarioId);
    void updateUsuarioEmail(Long usuarioId, String newEmail);
    Set<String> getRole (String email);
}
