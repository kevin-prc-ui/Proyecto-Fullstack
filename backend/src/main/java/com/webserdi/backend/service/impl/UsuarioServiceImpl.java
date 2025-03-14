package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.PermisoMapper;
import com.webserdi.backend.mapper.UsuarioMapper;
import com.webserdi.backend.repository.PermisoRepository;
import com.webserdi.backend.repository.RolRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

//Esta anotacion le dice al spring container que genere el spring bean para esta clase UsuarioServiceImpl
@Service
public class UsuarioServiceImpl implements UsuarioService, UserDetailsService {
    private final PermisoRepository permisoRepository;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioServiceImpl(PermisoRepository permisoRepository,
                              RolRepository rolRepository,
                              UsuarioRepository usuarioRepository,
                              PasswordEncoder passwordEncoder) {
        this.permisoRepository = permisoRepository;
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        if(usuarioRepository.existsByEmail(usuarioDto.getEmail())){
            throw new ResourceNotFoundException("El usuario ya existe");
        }
        Rol rol = rolRepository.findById(usuarioDto.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("No existe el rol con el id " + usuarioDto.getRolId()));
        Usuario usuario = UsuarioMapper.mapToUsuario(usuarioDto);
        usuario.setRol(rol); // Asigna el rol al usuario
        usuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));
        if(usuarioDto.getPermisos() != null && !usuarioDto.getPermisos().isEmpty()){
            Set<Permiso> permisos = permisoRepository.findByNombreIn(usuarioDto.getPermisos());
            usuario.setPermisos(permisos);
        }else{
            usuario.setPermisos(new HashSet<>());
        }
        usuario = usuarioRepository.save(usuario);

        return UsuarioMapper.mapToUsuarioDto(usuario);
    }
    @Override
    @Transactional
    public UsuarioDto checkOrCreateUser(UsuarioDto usuarioDto) {
        if (!usuarioRepository.existsByEmail(usuarioDto.getEmail())) {//Si el usuario no existe, se crea
            // User exists, do nothing (or you can update the user if needed)
            return createUsuario(usuarioDto);
        }
        return null;
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
            Set<Permiso> nuevosPermisos = permisoRepository.findByNombreIn(usuarioDto.getPermisos()
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
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username or email:" + email));

        Set<GrantedAuthority> authorities = new HashSet<>();
        usuario.getPermisos().forEach(permiso -> authorities.add(new SimpleGrantedAuthority(permiso.getNombre())));

        return new User(usuario.getEmail(), usuario.getPassword(), authorities);
    }

}