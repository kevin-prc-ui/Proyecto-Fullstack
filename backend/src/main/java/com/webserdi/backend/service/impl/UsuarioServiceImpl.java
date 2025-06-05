package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.entity.Departamento; // Importar entidad Departamento
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.entity.Rol;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.exception.DuplicateEmailException;
import com.webserdi.backend.mapper.PermisoMapper;
import com.webserdi.backend.mapper.UsuarioMapper;
import com.webserdi.backend.repository.DepartamentoRepository; // Importar DepartamentoRepository
import com.webserdi.backend.repository.PermisoRepository;
import com.webserdi.backend.repository.RolRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor; // Usar para inyección de dependencias
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils; // Para comprobaciones de colecciones
import org.springframework.util.StringUtils;    // Para validaciones de String

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementación del servicio para la gestión de Usuarios.
 */
@Service
@RequiredArgsConstructor // Inyecta todas las dependencias finales a través del constructor
public class UsuarioServiceImpl implements UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioServiceImpl.class);

    private final PermisoRepository permisoRepository;
    private final UsuarioMapper usuarioMapper;
    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final DepartamentoRepository departamentoRepository; // Añadir dependencia
    private final PasswordEncoder passwordEncoder;
    // El UsuarioMapper es estático, no necesita inyección si se mantiene así.

    /**
     * Crea un nuevo usuario.
     *
     * @param usuarioDto DTO con la información del usuario a crear.
     * @return DTO del usuario creado.
     * @throws DuplicateEmailException Si el email ya está en uso.
     * @throws ResourceNotFoundException Si los datos del DTO son inválidos.
     * @throws ResourceNotFoundException Si el departamento o roles/permisos especificados no existen.
     */
    @Override
    @Transactional
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        logger.info("Intentando crear usuario con email: {}", usuarioDto.getEmail());
        validateUsuarioDtoForCreation(usuarioDto);

        if (usuarioRepository.existsByEmail(usuarioDto.getEmail())) {
            logger.warn("Intento de crear usuario con email duplicado: {}", usuarioDto.getEmail());
            throw new DuplicateEmailException("El email '" + usuarioDto.getEmail() + "' ya está en uso.");
        }

        Usuario usuario = usuarioMapper.mapToUsuario(usuarioDto);
        usuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));
        // 'enabled' se toma del DTO, por defecto podría ser true o false según la lógica de negocio

        setUsuarioRelationships(usuario, usuarioDto);

        Usuario savedUsuario = usuarioRepository.save(usuario);
        logger.info("Usuario creado exitosamente con ID: {}", savedUsuario.getId());
        return usuarioMapper.mapToUsuarioDto(savedUsuario);
    }

    /**
     * Valida el DTO de usuario para la creación.
     *
     * @param dto El DTO a validar.
     * @throws ResourceNotFoundException Si la validación falla.
     */
    private void validateUsuarioDtoForCreation(UsuarioDto dto) {
        Objects.requireNonNull(dto, "El DTO de usuario no puede ser nulo.");
        if (!StringUtils.hasText(dto.getNombre())) {
            throw new ResourceNotFoundException("El nombre del usuario es obligatorio.");
        }
        if (!StringUtils.hasText(dto.getApellido())) {
            throw new ResourceNotFoundException("El apellido del usuario es obligatorio.");
        }
        if (!StringUtils.hasText(dto.getEmail())) {
            throw new ResourceNotFoundException("El email del usuario es obligatorio.");
            // Aquí se podría añadir validación de formato de email
        }
        if (!StringUtils.hasText(dto.getPassword())) {
            throw new ResourceNotFoundException("La contraseña es obligatoria para crear un usuario.");
        }
        if (CollectionUtils.isEmpty(dto.getRoles())) {
            throw new ResourceNotFoundException("Se debe asignar al menos un rol al usuario.");
        }
        // El departamento es opcional en la entidad Usuario, pero podría ser obligatorio según la lógica de negocio.
        // if (dto.getDepartamento() == null || dto.getDepartamento().getId() == null) {
        //     throw new ResourceNotFoundException("El departamento es obligatorio para el usuario.");
        // }
    }

    /**
     * Establece las relaciones del usuario (Departamento, Roles, Permisos).
     *
     * @param usuario La entidad Usuario.
     * @param dto El DTO con la información de las relaciones.
     * @throws ResourceNotFoundException Si alguna entidad relacionada no se encuentra.
     */
    private void setUsuarioRelationships(Usuario usuario, UsuarioDto dto) {
        // Asignar Departamento (si se proporciona)
        if (dto.getDepartamento() != null && dto.getDepartamento().getId() != null) {
            Departamento departamento = departamentoRepository.findById(dto.getDepartamento().getId())
                    .orElseThrow(() -> {
                        logger.warn("Departamento no encontrado con ID: {}", dto.getDepartamento().getId());
                        return new ResourceNotFoundException("Departamento no encontrado con ID: " + dto.getDepartamento().getId());
                    });
            usuario.setDepartamento(departamento);
        } else {
            usuario.setDepartamento(null); // Asegurar que sea null si no se proporciona
        }

        // Asignar Roles
        if (!CollectionUtils.isEmpty(dto.getRoles())) {
            Set<Rol> roles = rolRepository.findByNombreIn(dto.getRoles());
            if (roles.size() != dto.getRoles().size()) {
                // Encontrar los roles que no se encontraron para un mensaje de error más específico
                Set<String> foundRoleNames = roles.stream().map(Rol::getNombre).collect(Collectors.toSet());
                dto.getRoles().removeAll(foundRoleNames);
                logger.warn("Algunos roles no fueron encontrados: {}", dto.getRoles());
                throw new ResourceNotFoundException("Uno o más roles especificados no existen: " + dto.getRoles());
            }
            usuario.setRoles(roles);
        } else {
            usuario.setRoles(Collections.emptySet()); // O lanzar error si se requiere al menos un rol
        }

        // Asignar Permisos (opcional, los permisos a menudo se derivan de los roles)
        if (!CollectionUtils.isEmpty(dto.getPermisos())) {
            Set<Permiso> permisos = permisoRepository.findByNombreIn(dto.getPermisos());
            if (permisos.size() != dto.getPermisos().size()) {
                Set<String> foundPermisoNames = permisos.stream().map(Permiso::getNombre).collect(Collectors.toSet());
                dto.getPermisos().removeAll(foundPermisoNames);
                usuario.setPermisos(Collections.emptySet());
            }
            usuario.setPermisos(permisos);
        } else {
            usuario.setPermisos(Collections.emptySet());
        }
    }


    /**
     * Obtiene todos los usuarios.
     *
     * @return Lista de DTOs de todos los usuarios.
     */
    @Override
    @Transactional(readOnly = true) // Buena práctica para operaciones de solo lectura
    public List<UsuarioDto> getAllUsuarios() {
        logger.debug("Obteniendo todos los usuarios.");
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(usuarioMapper::mapToUsuarioDto)
                .toList();
    }

    @Override
    public List<UsuarioDto> getUsuarioByDepartamento(Long id) {
        List<Usuario> usuarios = usuarioRepository.findAllByDepartamentoId(id);
        return usuarios.stream()
                .map(usuarioMapper::mapToUsuarioDto)
                .toList();
    }

    /**
     * Obtiene un usuario por su ID.
     *
     * @param usuarioId ID del usuario.
     * @return DTO del usuario encontrado.
     * @throws ResourceNotFoundException Si el usuario no existe.
     */
    @Override
    @Transactional(readOnly = true)
    public UsuarioDto getUsuarioById(Long usuarioId) {
        logger.debug("Obteniendo usuario por ID: {}", usuarioId);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado con ID: {}", usuarioId);
                    return new ResourceNotFoundException("No existe el usuario con el ID: " + usuarioId);
                });
        return usuarioMapper.mapToUsuarioDto(usuario);
    }

    /**
     * Actualiza un usuario existente.
     *
     * @param usuarioId ID del usuario a actualizar.
     * @param usuarioDto DTO con la información actualizada.
     * @return DTO del usuario actualizado.
     * @throws ResourceNotFoundException Si el usuario no existe.
     * @throws DuplicateEmailException Si el nuevo email ya está en uso por otro usuario.
     * @throws ResourceNotFoundException Si los datos del DTO son inválidos.
     */
    @Override
    @Transactional
    public UsuarioDto updateUsuario(Long usuarioId, UsuarioDto usuarioDto) {
        logger.info("Intentando actualizar usuario con ID: {}", usuarioId);
        validateUsuarioDtoForUpdate(usuarioDto);

        Usuario savedUsuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado para actualizar con ID: {}", usuarioId);
                    return new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId);
                });

        // Verificar si el email ha cambiado y si ya existe
        if (StringUtils.hasText(usuarioDto.getEmail()) && !savedUsuario.getEmail().equals(usuarioDto.getEmail())) {
            if (usuarioRepository.existsByEmailAndIdNot(usuarioDto.getEmail(), usuarioId)) {
                logger.warn("Intento de actualizar a email duplicado: {} para usuario ID: {}", usuarioDto.getEmail(), usuarioId);
                throw new DuplicateEmailException("El email '" + usuarioDto.getEmail() + "' ya está en uso por otro usuario.");
            }
            savedUsuario.setEmail(usuarioDto.getEmail());
        }

        // Actualizar datos básicos
        savedUsuario.setNombre(usuarioDto.getNombre());
        savedUsuario.setApellido(usuarioDto.getApellido());
        savedUsuario.setEnabled(usuarioDto.isEnabled());

        // Actualizar contraseña solo si se proporciona una nueva
        if (StringUtils.hasText(usuarioDto.getPassword())) {
            logger.debug("Actualizando contraseña para usuario ID: {}", usuarioId);
            savedUsuario.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));
        }

        // Actualizar relaciones
        setUsuarioRelationships(savedUsuario, usuarioDto); // Reutilizar método

        Usuario usuarioActualizado = usuarioRepository.save(savedUsuario);
        logger.info("Usuario con ID: {} actualizado exitosamente.", usuarioId);
        return usuarioMapper.mapToUsuarioDto(usuarioActualizado);
    }

    /**
     * Valida el DTO de usuario para la actualización.
     *
     * @param dto El DTO a validar.
     * @throws ResourceNotFoundException Si la validación falla.
     */
    private void validateUsuarioDtoForUpdate(UsuarioDto dto) {
        Objects.requireNonNull(dto, "El DTO de usuario no puede ser nulo para la actualización.");
        if (!StringUtils.hasText(dto.getNombre())) {
            throw new ResourceNotFoundException("El nombre del usuario es obligatorio.");
        }
        if (!StringUtils.hasText(dto.getApellido())) {
            throw new ResourceNotFoundException("El apellido del usuario es obligatorio.");
        }
        // Email es opcional en la actualización, si no viene, no se cambia.
        // Password es opcional, si no viene, no se cambia.
        // Roles son opcionales, si no vienen, no se cambian (o se limpian según la lógica de negocio).
        // Para este ejemplo, si vienen roles vacíos, se limpian los roles.
        // if (dto.getRoles() == null) { // Si es null, no se tocan. Si es vacío, se limpian.
        //     throw new ResourceNotFoundException("La lista de roles no puede ser nula (puede ser vacía para quitar todos los roles).");
        // }
    }

    /**
     * Elimina un usuario por su ID.
     *
     * @param usuarioId ID del usuario a eliminar.
     * @throws ResourceNotFoundException Si el usuario no existe.
     */
    @Override
    @Transactional
    public void deleteUsuario(Long usuarioId) {
        logger.info("Intentando eliminar usuario con ID: {}", usuarioId);
        if (!usuarioRepository.existsById(usuarioId)) {
            logger.warn("Usuario no encontrado para eliminar con ID: {}", usuarioId);
            throw new ResourceNotFoundException("No existe el usuario con el ID: " + usuarioId);
        }
        // Considerar si hay dependencias que impidan la eliminación (ej. tickets creados por este usuario)
        // o si se debe hacer un soft delete.
        usuarioRepository.deleteById(usuarioId);
        logger.info("Usuario con ID: {} eliminado exitosamente.", usuarioId);
    }

    /**
     * Obtiene todos los permisos disponibles en el sistema.
     *
     * @return Lista de DTOs de permisos.
     */
    @Override
    @Transactional(readOnly = true)
    public List<PermisoDto> getAllPermisos(String email) {
        logger.debug("Obteniendo todos los permisos para el usuario con email: {}", email);
        if (!StringUtils.hasText(email)) {
            throw new ResourceNotFoundException("El email del usuario no puede estar vacío.");
        }

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado con email: {}", email);
                    return new ResourceNotFoundException("No existe el usuario con el email: " + email);
                });

        // Usar un Set para evitar permisos duplicados si un permiso está asignado directamente Y a través de un rol.
        Set<Permiso> permisosDelUsuario = new HashSet<>();

        // Añadir permisos directos del usuario
        if (!CollectionUtils.isEmpty(usuario.getPermisos())) {
            permisosDelUsuario.addAll(usuario.getPermisos());
        }

        // Añadir permisos de los roles del usuario
        // Asumiendo que la entidad Rol tiene un método getPermisos() que devuelve Set<Permiso>
        // y que los roles y sus permisos se cargan (EAGER o se obtienen aquí)
        if (!CollectionUtils.isEmpty(usuario.getRoles())) {
            for (Rol rol : usuario.getRoles()) {
                if (!CollectionUtils.isEmpty(rol.getPermisos())) { // Asegúrate que Rol tenga getPermisos()
                    permisosDelUsuario.addAll(rol.getPermisos());
                }
            }
        }

        if (permisosDelUsuario.isEmpty()) {
            logger.debug("El usuario con email {} no tiene permisos asignados.", email);
            return Collections.emptyList();
        }

        return permisosDelUsuario.stream()
                .map(PermisoMapper::toDto) // Asumiendo que PermisoMapper tiene un método estático toDto
                .distinct() // Aunque el Set ya maneja duplicados de entidades, por si acaso en el DTO.
                .collect(Collectors.toList());
    }

    /**
     * Actualiza el email de un usuario.
     *
     * @param usuarioId ID del usuario.
     * @param newEmail Nuevo email.
     * @throws ResourceNotFoundException Si el usuario no existe.
     * @throws DuplicateEmailException Si el nuevo email ya está en uso.
     * @throws ResourceNotFoundException Si el nuevo email es inválido.
     */
    @Override
    @Transactional
    public void updateUsuarioEmail(Long usuarioId, String newEmail) {
        logger.info("Intentando actualizar email para usuario ID: {} al nuevo email: {}", usuarioId, newEmail);
        if (!StringUtils.hasText(newEmail)) {
            throw new ResourceNotFoundException("El nuevo email no puede estar vacío.");
        }
        // Aquí se podría añadir validación de formato de email

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado para actualizar email con ID: {}", usuarioId);
                    return new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioId);
                });

        if (usuario.getEmail().equals(newEmail)) {
            logger.info("El nuevo email es el mismo que el actual para usuario ID: {}. No se requiere actualización.", usuarioId);
            return; // No hay cambios
        }

        if (usuarioRepository.existsByEmailAndIdNot(newEmail, usuarioId)) {
            logger.warn("Intento de actualizar a email duplicado: {} para usuario ID: {}", newEmail, usuarioId);
            throw new DuplicateEmailException("El email '" + newEmail + "' ya está en uso por otro usuario.");
        }

        usuario.setEmail(newEmail);
        usuarioRepository.save(usuario);
        logger.info("Email actualizado exitosamente para usuario ID: {}", usuarioId);
    }

    /**
     * Obtiene los nombres de los roles de un usuario por su email.
     *
     * @param email Email del usuario.
     * @return Conjunto de nombres de roles.
     * @throws ResourceNotFoundException Si el usuario no existe.
     */

    @Override
    @Transactional(readOnly = true)
    public Set<String> getRole(String email) {
        logger.debug("Obteniendo roles para el email: {}", email);
        Usuario user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado con email: {}", email);
                    return new ResourceNotFoundException("No existe el usuario con el email: " + email);
                });
        if (CollectionUtils.isEmpty(user.getRoles())) {
            return Collections.emptySet();
        }
        return user.getRoles().stream()
                .map(Rol::getNombre)
                .collect(Collectors.toSet());
    }

    /**
     * Obtiene el ID de un usuario por su email.
     *
     * @param email Email del usuario.
     * @return ID del usuario.
     * @throws ResourceNotFoundException Si el usuario no existe.
     */
    @Override
    @Transactional(readOnly = true)
    public Long getIdByEmail(String email) {
        logger.debug("Obteniendo ID para el email: {}", email);
        return usuarioRepository.findByEmail(email)
                .map(Usuario::getId)
                .orElseThrow(() -> {
                    logger.warn("Usuario no encontrado con email: {}", email);
                    return new ResourceNotFoundException("No existe el usuario con el email: " + email);
                });
    }

}