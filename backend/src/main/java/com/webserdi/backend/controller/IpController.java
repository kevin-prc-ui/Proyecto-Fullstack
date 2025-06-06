package com.webserdi.backend.controller;

import com.webserdi.backend.dto.IpDto;
import com.webserdi.backend.entity.Ip;
import com.webserdi.backend.service.IpService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ip")
@AllArgsConstructor
public class IpController {
    private final IpService ipService;

    @PostMapping
    public ResponseEntity<IpDto> registrarIpUsuario(@RequestBody IpDto ipDto, Authentication authentication) {
        String ip = ipDto.getIp();
        String email = authentication.getName();
        if (!authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        IpDto createdIp = ipService.registrarIpUsuario(ip, email);
        return ResponseEntity.ok(createdIp);
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<IpDto>> ObtenerIpsPorUsuario(Authentication authentication) {
        String usuarioEmail = authentication.getName();
        List<IpDto> ipDto = ipService.obtenerIpsPorUsuario(usuarioEmail);
        return ResponseEntity.ok(ipDto);
    }

    @GetMapping
    public ResponseEntity<List<IpDto>> getAllIps() {
        List<IpDto> ips = ipService.obtenerTodasLasIps();
        return ResponseEntity.ok(ips);
    }

}

