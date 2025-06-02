package com.webserdi.backend.controller;


import com.webserdi.backend.dto.ArchivoDto;
import com.webserdi.backend.entity.Archivo;
import com.webserdi.backend.service.ArchivoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/archivos")
@AllArgsConstructor
public class ArchivoController {

    private final ArchivoService archivoService;

    @PostMapping
    public ResponseEntity<ArchivoDto> createArchivo(@RequestBody ArchivoDto archivoDto) {
        ArchivoDto createdArchivo = archivoService.createArchivo(archivoDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArchivo);
    }

    @GetMapping("/{archivoId}")
    public ResponseEntity<ArchivoDto> getArchivoById(@PathVariable Long archivoId) {
        ArchivoDto archivoDto = archivoService.getArchivoById(archivoId);
        return ResponseEntity.ok(archivoDto);
    }

    @GetMapping
    public ResponseEntity<List<ArchivoDto>> getAllArchivos() {
        List<ArchivoDto> archivos = archivoService.getAllArchivos();
        return ResponseEntity.ok(archivos);
    }

    @PutMapping("/{archivoId}")
    public ResponseEntity<ArchivoDto> updateArchivo(@PathVariable Long archivoId, @RequestBody ArchivoDto archivoDto) {
        ArchivoDto updatedArchivo = archivoService.updateArchivo(archivoId, archivoDto);
        return ResponseEntity.ok(updatedArchivo);
    }

    @DeleteMapping("/{archivoId}")
    public ResponseEntity<Void> deleteArchivo(@PathVariable Long archivoId) {
        archivoService.deleteArchivo(archivoId);
        return ResponseEntity.noContent().build();
    }
}
