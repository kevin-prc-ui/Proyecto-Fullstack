package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface Users_Roles extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findUsuarioById(Long id);
}
