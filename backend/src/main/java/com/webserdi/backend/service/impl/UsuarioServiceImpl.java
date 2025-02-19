package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.UsuarioMapper;
import com.webserdi.backend.repository.RolRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

//Esta anotacion le dice al spring container que genere el spring bean para esta clase UsuarioServiceImpl
@Service
@AllArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

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
    public UsuarioDto updateUsuario(Long usuarioId,UsuarioDto usuarioDto) {
        Usuario savedUsuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(()->
                        new ResourceNotFoundException("No existe el usuario con el id" + usuarioDto.getId()));
        Rol rol = rolRepository.findById(usuarioDto.getRolId())
                .orElseThrow(()->
                        new RuntimeException("No existe el rol con el id " + usuarioDto.getRolId()));
        savedUsuario.setNombre(usuarioDto.getNombre());
        savedUsuario.setApellido(usuarioDto.getApellido());
        savedUsuario.setEmail(usuarioDto.getEmail());
        savedUsuario.setRol(rol);
        savedUsuario = usuarioRepository.save(savedUsuario);
        return UsuarioMapper.mapToUsuarioDto(savedUsuario);
    }

    @Override
    public void deleteUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).
                orElseThrow(()->
                        new ResourceNotFoundException("No existe el usuario con el id" + usuarioId));
        usuarioRepository.deleteById(usuarioId);
    }
}
