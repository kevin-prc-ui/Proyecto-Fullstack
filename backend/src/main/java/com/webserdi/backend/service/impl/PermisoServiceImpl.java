package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.entity.Permiso;
import com.webserdi.backend.mapper.PermisoMapper;
import com.webserdi.backend.repository.PermisoRepository;
import com.webserdi.backend.service.PermisoService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PermisoServiceImpl implements PermisoService {
    private PermisoRepository permisoRepository;

    @Override
    public PermisoDto createPermiso(PermisoDto permisoDto) {
        Permiso permiso = PermisoMapper.mapToPermiso(permisoDto);
        permiso = permisoRepository.save(permiso);

        return PermisoMapper.mapToPermisoDto(permiso);
    }

    @Override
    public List<PermisoDto> getAllPermisos() {
        List<Permiso> permiso = permisoRepository.findAll();
        return permiso.stream()
                .map(PermisoMapper::mapToPermisoDto)
                .collect(Collectors.toList());
    }
}
