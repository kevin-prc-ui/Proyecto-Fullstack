package com.webserdi.backend.controller;

import com.webserdi.backend.dto.RolDto;
import com.webserdi.backend.service.RolService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
@AllArgsConstructor
public class RolController {
    private RolService rolService;

    @PostMapping
    public ResponseEntity<RolDto> createRol(@RequestBody RolDto rolDto) {
        RolDto savedRol = rolService.createRol(rolDto);
        return new ResponseEntity<>(savedRol, HttpStatus.CREATED);
    }
}
