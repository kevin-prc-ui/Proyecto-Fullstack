package com.webserdi.backend.controller;
import com.webserdi.backend.dto.JwtAuthResponse;
import com.webserdi.backend.dto.LoginDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.security.JwtTokenProvider;
import com.webserdi.backend.service.AuthService;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioService usuarioService;
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    // Build Login REST API
    @PreAuthorize("permitAll()")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            String token = authService.login(loginDto);

            JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
            jwtAuthResponse.setAccessToken(token);

            return ResponseEntity.ok(jwtAuthResponse);
        } catch (AuthenticationException e) { // Captura todas las excepciones de autenticación
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("mensaje", "Usuario o contraseña incorrectos"));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        // Extract the token from the Authorization header
        String token = extractTokenFromHeader(authorizationHeader);
        // Invalidate the token (add it to a blacklist or similar)
        if (token != null) {
            // Invalidate the token (add it to a blacklist or similar)
            jwtTokenProvider.invalidateToken(token);
        }
        // Clear the security context
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout successful");
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/signup")
    public ResponseEntity<UsuarioDto> signUp(@RequestBody UsuarioDto user) {
        UsuarioDto createdUser = usuarioService.createUsuario(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    private String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}