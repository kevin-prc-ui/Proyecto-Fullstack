package com.webserdi.backend.controller;

import com.webserdi.backend.dto.PermisoDto;
import com.webserdi.backend.service.PermisoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permisos")
@AllArgsConstructor
public class PermisoController extends BaseController {
    private PermisoService permisoService;

    @PostMapping
    public ResponseEntity<PermisoDto> createPermiso(@RequestBody PermisoDto permisoDto) {
        PermisoDto savedPermisos = permisoService.createPermiso(permisoDto);
        return new ResponseEntity<>(savedPermisos, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PermisoDto>> getAllPermisos() {
        List<PermisoDto> permisos = permisoService.getAllPermisos();
        return ResponseEntity.ok(permisos);
    }
}
