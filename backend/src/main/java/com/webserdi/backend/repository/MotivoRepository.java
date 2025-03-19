package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Motivo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MotivoRepository extends JpaRepository<Motivo, Long> {
}