package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.IpDto;
import com.webserdi.backend.entity.Ip;
import com.webserdi.backend.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class IpMapper {

    public static IpDto toDto(Ip ip) {
        if (ip == null) {
            return null;
        }
        IpDto dto = new IpDto();
        dto.setId(ip.getId());
        dto.setIp(ip.getIp());
        dto.setFechaRegistro(ip.getFechaRegistro());
        if (ip.getUsuario() != null) {
            dto.setUsuarioEmail(ip.getUsuario().getEmail());
            dto.setNombreUsuario(ip.getUsuario().getNombre() + " " + ip.getUsuario().getApellido());
        }
        return dto;
    }

    // No es común tener un toEntity para IpDto si la creación se maneja con parámetros directos
    // Pero si lo necesitas:
    public static Ip toEntity(IpDto dto, Usuario usuario) { // Necesitarías la entidad Usuario
        if (dto == null) {
            return null;
        }
        Ip ip = new Ip();
        ip.setIp(dto.getIp());
        ip.setUsuario(usuario); // Asignar la entidad Usuario
        // fechaRegistro se establece automáticamente
        return ip;
    }
}