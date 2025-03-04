package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.entity.Permiso;

public class PermisoMapper {
    public static PermisoDto mapToPermisoDto(Permiso permiso) {
        return new PermisoDto(
                permiso.getId(),
                permiso.getNombre()
        );
    }
    public static Permiso mapToPermiso(PermisoDto permisoDto) {
        return new Permiso(
                permisoDto.getId(),
                permisoDto.getNombre()
        );
    }
}
