package com.webserdi.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Reference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String nombre;

    private String apellido;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id",referencedColumnName = "id")
    private Rol rol;
}
