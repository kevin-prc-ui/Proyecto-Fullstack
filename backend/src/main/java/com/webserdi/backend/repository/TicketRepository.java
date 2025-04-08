// TicketRepository.java
package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT MAX(t.codigo) FROM Ticket t")
    String findMaxCodigo();

    Page<Ticket> findAllByIsTrashedTrue(Pageable pageable);
    Page<Ticket> findAllByIsTrashedFalse(Pageable pageable);
    Page<Ticket> findAllByEstadoNombre(String filtro, Pageable pageable);
}