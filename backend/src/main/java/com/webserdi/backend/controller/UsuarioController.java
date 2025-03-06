package com.webserdi.backend.controller;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.dto.UsuarioPermisoDto;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.UsuarioMapper;
import com.webserdi.backend.repository.PermisoRepository;
import com.webserdi.backend.repository.RolRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.UsuarioService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UsuarioController implements WebMvcConfigurer {
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

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
    @GetMapping("/permisos")
    public ResponseEntity<List<PermisoDto>>getAllPermisos(){
        List<PermisoDto> permisos = usuarioService.getAllPermisos();
        return ResponseEntity.ok(permisos);
    }

    @PostMapping("/check-or-create")
    @Transactional
    public ResponseEntity<UsuarioDto> checkOrCreateUser(@RequestBody UsuarioDto usuarioDto) {
        return usuarioRepository.findByEmail(usuarioDto.getEmail())
                .map(usuario -> ResponseEntity.ok(usuarioMapper.mapToUsuarioDto(usuario)))
                .orElseGet(() -> {
                    Rol rol = rolRepository.findById(usuarioDto.getRolId())
                            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

                    Usuario nuevoUsuario = new Usuario();
                    nuevoUsuario.setEmail(usuarioDto.getEmail());
                    nuevoUsuario.setNombre(usuarioDto.getNombre());
                    nuevoUsuario.setApellido(usuarioDto.getApellido());
                    nuevoUsuario.setEnabled(usuarioDto.isEnabled());
                    nuevoUsuario.setRol(rol);

                    // Asignar permisos
                    Set<Permiso> permisos = permisoRepository.findByNombreIn(usuarioDto.getPermisos());
                    nuevoUsuario.setPermisos(permisos);

                    return ResponseEntity.status(HttpStatus.CREATED)
                            .body(usuarioMapper.toDto(usuarioRepository.save(nuevoUsuario)));
                });
    }
}
