package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.IpDto;
import com.webserdi.backend.entity.Ip;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.exception.ResourceNotFoundException;
import com.webserdi.backend.mapper.IpMapper;
import com.webserdi.backend.repository.IpRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.service.IpService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Lombok genera el constructor con todas las dependencias finales
public class IpServiceImplementation implements IpService {

    private static final Logger logger = LoggerFactory.getLogger(IpServiceImplementation.class);

    private final IpRepository ipRepository;
    private final UsuarioRepository usuarioRepository; // Para buscar el usuario por ID
    // private final IpMapper ipMapper; // Si IpMapper no es estático, inyéctalo

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public IpDto registrarIpUsuario(String ip, String usuarioEmail) {
        if (!StringUtils.hasText(ip)) {
            throw new ResourceNotFoundException("La dirección IP no puede estar vacía.");
        }
        if (!StringUtils.hasText(usuarioEmail)) {
            throw new ResourceNotFoundException("El Email del usuario es requerido para registrar una IP de usuario.");
        }

        Usuario usuario = usuarioRepository.findByEmail(usuarioEmail)
                .orElseThrow(() -> {
                    logger.warn("Intento de registrar IP para usuario no existente con EMAIL: {}", usuarioEmail);
                    return new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioEmail);
                });


        Ip nuevaIp = new Ip(ip, usuario);
        nuevaIp.setFechaRegistro(LocalDateTime.now());
        Ip ipGuardada = ipRepository.save(nuevaIp);
        logger.info("IP {} registrada para el usuario Email {} (User-Agent: {})", ip, usuarioEmail);
        return IpMapper.toDto(ipGuardada); // Usa el mapper estático
    }

    @Override
    @Transactional(readOnly = true)
    public List<IpDto> obtenerIpsPorUsuario(String usuarioEmail) {
        if (!StringUtils.hasText(usuarioEmail)) {
            throw new ResourceNotFoundException("El ID de usuario es requerido para obtener sus IPs.");
        }
        Usuario usuario = usuarioRepository.findByEmail(usuarioEmail)
                .orElseThrow();

        logger.debug("Obteniendo IPs para el usuario ID: {}", usuarioEmail);
        List<Ip> ips = ipRepository.findByUsuarioId(usuario.getId());
        return ips.stream().map(IpMapper::toDto).collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<IpDto> obtenerTodasLasIps() {
        logger.debug("Obteniendo todas las IPs registradas.");
        List<Ip> todasLasIps = ipRepository.findAll();
        // Considerar paginación aquí si la lista puede ser muy grande
        // Page<Ip> ipPage = ipRepository.findAll(pageable);
        // return ipPage.map(IpMapper::toDto);
        return todasLasIps.stream().map(IpMapper::toDto).collect(Collectors.toList());
    }
}