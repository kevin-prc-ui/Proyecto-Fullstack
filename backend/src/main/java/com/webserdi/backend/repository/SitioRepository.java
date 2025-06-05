package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Sitio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SitioRepository extends JpaRepository<Sitio, Long> {
    Optional<Sitio> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
