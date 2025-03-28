package com.webserdi.backend.controller;

import com.webserdi.backend.dto.MotivoDto;
import com.webserdi.backend.service.MotivoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motivos")
@AllArgsConstructor
public class MotivoController {

    private final MotivoService motivoService;

    @PostMapping
    public ResponseEntity<MotivoDto> createMotivo(@RequestBody MotivoDto motivoDto) {
        MotivoDto createdMotivo = motivoService.createMotivo(motivoDto);
        return ResponseEntity.ok(createdMotivo);
    }

    @GetMapping("/{motivoId}")
    public ResponseEntity<MotivoDto> getMotivoById(@PathVariable Long motivoId) {
        MotivoDto motivoDto = motivoService.getMotivoById(motivoId);
        return ResponseEntity.ok(motivoDto);
    }

    @GetMapping
    public ResponseEntity<List<MotivoDto>> getAllMotivos() {
        List<MotivoDto> motivos = motivoService.getAllMotivos();
        return ResponseEntity.ok(motivos);
    }

    @PutMapping("/{motivoId}")
    public ResponseEntity<MotivoDto> updateMotivo(@PathVariable Long motivoId, @RequestBody MotivoDto motivoDto) {
        MotivoDto updatedMotivo = motivoService.updateMotivo(motivoId, motivoDto);
        return ResponseEntity.ok(updatedMotivo);
    }

    @DeleteMapping("/{motivoId}")
    public ResponseEntity<Void> deleteMotivo(@PathVariable Long motivoId) {
        motivoService.deleteMotivo(motivoId);
        return ResponseEntity.noContent().build();
    }
}