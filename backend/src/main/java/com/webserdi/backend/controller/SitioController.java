package com.webserdi.backend.controller;

import com.webserdi.backend.dto.SitioDto;
import com.webserdi.backend.service.SitioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sitios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SitioController {

    private final SitioService sitioService;

    @PostMapping
    public ResponseEntity<SitioDto> crearSitio(@RequestBody SitioDto sitioDto) {
        return ResponseEntity.ok(sitioService.crearSitio(sitioDto));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SitioDto>> listarSitiosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(sitioService.listarMisSitios(usuarioId));
    }

    @GetMapping("/slug/{id}")
    public ResponseEntity<List<SitioDto>> obtenerPorSlug(@PathVariable Long id) {
        return ResponseEntity.ok(sitioService.obtenerPorSlug(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSitio(@PathVariable Long id) {
        sitioService.eliminarSitio(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<SitioDto> actualizarSitio(@PathVariable Long id, @RequestBody SitioDto sitioDto) {
        return ResponseEntity.ok(sitioService.actualizarSitio(id, sitioDto));
    }
}
