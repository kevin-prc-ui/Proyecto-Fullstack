package com.webserdi.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "archivos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Archivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ruta")
    private String ruta;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private Boolean activo = true;

    private String tipo; // MIME type o extensión del archivo
    private Long tamaño; // Tamaño en bytes

    @CreationTimestamp
    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida;

    // Relación con la carpeta que contiene este archivo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carpeta_id")
    private Carpeta carpeta;

    @ManyToOne
    @JoinColumn(name = "sitio_id")
    private Sitio sitio;



}