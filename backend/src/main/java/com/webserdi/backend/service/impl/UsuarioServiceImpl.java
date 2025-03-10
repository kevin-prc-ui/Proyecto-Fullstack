package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.AppException;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.PermisoMapper;
import com.webserdi.backend.mapper.UsuarioMapper;
import com.webserdi.backend.repository.PermisoRepository;
import com.webserdi.backend.repository.RolRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

//Esta anotacion le dice al spring container que genere el spring bean para esta clase UsuarioServiceImpl
@Service
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {
    private final PermisoRepository permisoRepository;
    private final UsuarioMapper usuarioMapper;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        Rol rol = rolRepository.findById(usuarioDto.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe el rol con el id " + usuarioDto.getRolId()));
        Usuario usuario = UsuarioMapper.mapToUsuario(usuarioDto);
        usuario.setRol(rol); // Asigna el rol al usuario
        //You need to save the permissions, if the user provides them
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

            usuario.getPermisos().clear();
            usuario.getPermisos().addAll(new HashSet<>(nuevosPermisos));
        }
        usuario = usuarioRepository.save(usuario);

        return UsuarioMapper.mapToUsuarioDto(usuario);
    }

    @Override
    public UsuarioDto checkOrCreateUser(UsuarioDto usuarioDto) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(usuarioDto.getEmail());
        if (usuarioOptional.isEmpty()) {
            // User doesn't exist, create it
            return createUsuario(usuarioDto);
        } else {
            // User exists, get the Usuario from the Optional and map it.
            Usuario usuario = usuarioOptional.get();
            return UsuarioMapper.mapToUsuarioDto(usuario);
        }
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

    @Override
    public List<PermisoDto> getAllPermisos(){
        List<Permiso> permisos = permisoRepository.findAll();
        return permisos.stream()
                .map(PermisoMapper::toDto)
                .collect(Collectors.toList());
    }



}
