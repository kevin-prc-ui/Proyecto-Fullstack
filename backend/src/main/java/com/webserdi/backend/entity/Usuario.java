package com.webserdi.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    private boolean enabled;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", referencedColumnName = "id")
    private Rol rol;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_permisos",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    private Set<Permiso> permisos = new HashSet<>();

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", enabled=" + enabled +
                ", rol=" + (rol != null ? rol.getId() : null) + // Handle potential null rol
                ", permisos=" + permisos +
                '}';
    }
}