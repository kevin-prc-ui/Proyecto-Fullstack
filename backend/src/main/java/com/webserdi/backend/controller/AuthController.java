package com.webserdi.backend.controller;

import com.webserdi.backend.dto.LoginDto;
import com.webserdi.backend.dto.UsuarioDto;
import com.webserdi.backend.security.JwtTokenProvider;
import com.webserdi.backend.service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioService usuarioService;

    @PostMapping(value = {"/login", "/signin"})
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto){

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @PostMapping(value = {"/register"})
    public ResponseEntity<String> register (@RequestBody UsuarioDto usuarioDto){
        //check if the password and the confirmPassword are the same.
        if (usuarioDto.getPassword().isEmpty()){
            return new ResponseEntity<>("No se ingresó contraseña", HttpStatus.BAD_REQUEST);
        }
        usuarioService.createUsuario(usuarioDto);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

}