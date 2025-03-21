package com.webserdi.backend.service;

import com.webserdi.backend.dto.LoginDto;
import com.webserdi.backend.dto.UsuarioDto;

public interface AuthService {
    String login (LoginDto loginDto);
//    String register (UsuarioDto usuarioDto);
}
