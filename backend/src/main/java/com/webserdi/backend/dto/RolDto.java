package com.webserdi.backend.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class RolDto {
    private int id;
    private String nombre;
    private Set<String> permisos;

    public Set<String> getPermisos() {
        return permisos;
    }

    public void setPermisos(Set<String> permisos) {
        this.permisos = permisos;
    }
}


