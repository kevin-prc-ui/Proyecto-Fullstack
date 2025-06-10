package com.webserdi.backend.service;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.UsuarioDto;

import java.util.List;
import java.util.Set;

public interface UsuarioService {

    UsuarioDto createUsuario(UsuarioDto usuarioDto);
    UsuarioDto getUsuarioById(Long usuarioId);
    List<UsuarioDto> getAllUsuarios(Long id);
    List<PermisoDto> getAllPermisos(String email);
    UsuarioDto updateUsuario(Long usuarioId,UsuarioDto usuarioDto);
    void deleteUsuario(Long usuarioId);
    void updateUsuarioEmail(Long usuarioId, String newEmail);
    Set<String> getRole (String email);
    Long getIdByEmail(String email);
    List<UsuarioDto> getUsuarioByDepartamento (Long id);
    UsuarioDto getUsuarioByEmail(String email);
}
