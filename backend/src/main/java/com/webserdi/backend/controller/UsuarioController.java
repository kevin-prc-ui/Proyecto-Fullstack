package com.webserdi.backend.controller;

import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UsuarioController implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Autowired
    private final UsuarioService usuarioService;

    //Construccion del REST API de usuarios
    @PostMapping
    public ResponseEntity<UsuarioDto> createUsuario(@RequestBody UsuarioDto usuarioDto) {
        UsuarioDto createdUsuario = usuarioService.createUsuario(usuarioDto);
        return ResponseEntity.ok(createdUsuario);
    }

    @GetMapping("{id}")
    public ResponseEntity<UsuarioDto> getUsuarioById(@PathVariable("id")  Long usuarioId) {
        UsuarioDto usuarioDto = usuarioService.getUsuarioById(usuarioId);
        return ResponseEntity.ok(usuarioDto);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioDto>> getAllUsuarios() {
        List<UsuarioDto> usuarios = usuarioService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<UsuarioDto> updateUsuario(@PathVariable("id")Long usuarioId, @RequestBody UsuarioDto usuarioDto) {
        UsuarioDto updatedUsuario = usuarioService.updateUsuario(usuarioId,usuarioDto);
        return ResponseEntity.ok(updatedUsuario);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable("id")Long usuarioId) {
        usuarioService.deleteUsuario(usuarioId);
        return ResponseEntity.ok("Empleado eliminado");
    }
}
