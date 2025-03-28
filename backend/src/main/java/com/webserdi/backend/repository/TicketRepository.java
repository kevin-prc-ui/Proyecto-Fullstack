// TicketRepository.java
package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Ticket;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT MAX(t.codigo) FROM Ticket t")
    String findMaxCodigo();
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t.codigo FROM Ticket t ORDER BY t.id DESC LIMIT 1")
    String findLastCodigo();
}