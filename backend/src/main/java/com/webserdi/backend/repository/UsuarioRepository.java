package com.webserdi.backend.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.webserdi.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Remapper findByEmail(String email);
}
