package com.webserdi.backend.repository;

import com.webserdi.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

// 👉 Repositorio para la entidad User, extiende JpaRepository para tener acceso a operaciones CRUD
public interface UserRepository extends JpaRepository<User, Integer> {
    // 👉 No es necesario declarar nada más, JpaRepository ya provee métodos como:
    // findById, findAll, save, deleteById, etc.
}
