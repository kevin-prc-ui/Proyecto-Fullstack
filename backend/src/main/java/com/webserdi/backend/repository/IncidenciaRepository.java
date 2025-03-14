package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {
}