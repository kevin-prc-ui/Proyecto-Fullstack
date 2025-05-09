package com.webserdi.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data; // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa un Usuario en el sistema.
 */
@Entity
@NoArgsConstructor
@Data // Cuidado con @Data y relaciones JPA (puede causar problemas con equals/hashCode/toString en lazy loading)
// Considerar usar @Getter, @Setter, @ToString individualmente y generar equals/hashCode con cuidado.
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    /**
     * Contraseña hasheada del usuario. Nullable si se permite creación de usuarios
     * sin contraseña inicial (ej. vía invitación o SSO).
     */
    @Column(nullable = true) // Puede ser true si la contraseña se establece después o es opcional
    private String password;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    /** Indica si la cuenta del usuario está habilitada. */
    private boolean enabled = true; // Valor por defecto, podría ser false hasta activación

    /** Departamento al que pertenece el usuario (opcional). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id", nullable = true) // Nullable si un usuario puede no tener departamento
    @JsonBackReference("usuario-departamento") // Nombre único para la referencia
    private Departamento departamento;

    /** Roles asignados al usuario. */
    @ManyToMany(fetch = FetchType.EAGER) // EAGER para roles es común si se usan en seguridad con frecuencia
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Set<Rol> roles = new HashSet<>();

    /** Permisos directos asignados al usuario (adicionales a los de los roles). */
    @ManyToMany(fetch = FetchType.EAGER) // EAGER si se necesitan con frecuencia
    @JoinTable(
            name = "usuario_permisos",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    private Set<Permiso> permisos = new HashSet<>();

    @CreationTimestamp
    @Column(name="fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    // Considerar añadir @UpdateTimestamp para fecha_actualizacion si es relevante
}