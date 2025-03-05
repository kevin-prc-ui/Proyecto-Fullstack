package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PermisoRepository extends JpaRepository<Permiso,Long> {
    Optional<Permiso> findByNombre(String nombre);
    List<Permiso> findByNombreIn(List<String> nombres);
    List<Permiso> findByModuloId(Long moduloId);

}
