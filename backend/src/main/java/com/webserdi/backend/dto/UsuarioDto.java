package com.webserdi.backend.dto;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Data
public class UsuarioDto {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private boolean enabled;
    private DepartamentoDto departamento;
    private Set<String> roles=new HashSet<>();
    private Set<String> permisos=new HashSet<>();
}
