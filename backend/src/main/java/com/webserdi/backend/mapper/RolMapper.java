package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.RolDto;
import com.webserdi.backend.entity.Rol;

public class RolMapper {
    public static RolDto mapToRolDto(Rol rol) {
        return new RolDto(
                rol.getId(),
                rol.getNombre()
        );
    }
    public static Rol mapToRol(RolDto rolDto) {
        return new Rol(
                rolDto.getId(),
                rolDto.getNombre()
        );
    }
}
