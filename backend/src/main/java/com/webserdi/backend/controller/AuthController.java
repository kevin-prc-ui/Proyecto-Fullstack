package com.webserdi.backend.controller;

import com.webserdi.backend.dto.JwtAuthResponse;
import com.webserdi.backend.dto.LoginDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.service.AuthService;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioService usuarioService;
    private final AuthService authService;

    // Build Login REST API
    @PreAuthorize("permitAll()")
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto) {
        String token = authService.login(loginDto);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Set<Rol> roles = authentication.getAuthorities().stream()
                .map(authority -> {
                    Rol rol = new Rol();
                    rol.setNombre(authority.getAuthority());
                    return rol;
                })
                .collect(Collectors.toSet());

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token);
        jwtAuthResponse.setRoles(roles);

        return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Lógica para cerrar la sesión del usuario
        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/register")
    public ResponseEntity<UsuarioDto> register(@RequestBody @Validated UsuarioDto user) {
        UsuarioDto createdUser = usuarioService.createUsuario(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}