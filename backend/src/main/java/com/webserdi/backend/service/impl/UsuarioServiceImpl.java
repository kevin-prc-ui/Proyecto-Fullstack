package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.UsuarioMapper;
import com.webserdi.backend.repository.PermisoRepository;
import com.webserdi.backend.repository.RolRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//Esta anotacion le dice al spring container que genere el spring bean para esta clase UsuarioServiceImpl
@Service
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {
    private final PermisoRepository permisoRepository;
    private final UsuarioMapper usuarioMapper;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        Rol rol = rolRepository.findById(usuarioDto.getRolId())
                .orElseThrow(() -> new RuntimeException("No existe el rol con el id " + usuarioDto.getRolId()));
        Usuario usuario = UsuarioMapper.mapToUsuario(usuarioDto);
        usuario.setRol(rol); // Asigna el rol al usuario
        usuario = usuarioRepository.save(usuario);

        return UsuarioMapper.mapToUsuarioDto(usuario);

    }

    @Override
    public List<UsuarioDto> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(UsuarioMapper::mapToUsuarioDto)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDto getUsuarioById(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(()->
                        new ResourceNotFoundException("No existe el usuario con el id " + usuarioId));
        return UsuarioMapper.mapToUsuarioDto(usuario);
    }

    @Override
    public UsuarioDto updateUsuario(Long usuarioId, UsuarioDto usuarioDto) {
        Usuario savedUsuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario no encontrado con id: " + usuarioId));

        // Actualizar datos básicos
        savedUsuario.setNombre(usuarioDto.getNombre());
        savedUsuario.setApellido(usuarioDto.getApellido());
        savedUsuario.setEmail(usuarioDto.getEmail());

        // Actualizar rol
        Rol rol = rolRepository.findById(usuarioDto.getRolId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Rol no encontrado con id: " + usuarioDto.getRolId()));
        savedUsuario.setRol(rol);

        // Actualizar permisos
        if(usuarioDto.getPermisos() != null && !usuarioDto.getPermisos().isEmpty()) {
            List<Permiso> nuevosPermisos = permisoRepository.findByNombreIn(
                    new ArrayList<>(usuarioDto.getPermisos())
            );

            // Validar que todos los permisos existen
            if(nuevosPermisos.size() != usuarioDto.getPermisos().size()) {
                Set<String> permisosNoEncontrados = new HashSet<>(usuarioDto.getPermisos());
                nuevosPermisos.forEach(p -> permisosNoEncontrados.remove(p.getNombre()));

                throw new ResourceNotFoundException(
                        "Los siguientes permisos no existen: " + String.join(", ", permisosNoEncontrados)
                );
            }

            savedUsuario.getPermisos().clear();
            savedUsuario.getPermisos().addAll(new HashSet<>(nuevosPermisos));
        }

        Usuario usuarioActualizado = usuarioRepository.save(savedUsuario);
        return UsuarioMapper.mapToUsuarioDto(usuarioActualizado);
    }


    @Override
    public void deleteUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).
                orElseThrow(()->
                        new ResourceNotFoundException("No existe el usuario con el id" + usuarioId));
        usuarioRepository.deleteById(usuarioId);
    }
}
