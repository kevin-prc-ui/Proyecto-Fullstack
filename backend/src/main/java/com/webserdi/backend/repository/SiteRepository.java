package com.webserdi.backend.repository;

import com.webserdi.backend.entity.Sites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteRepository extends JpaRepository<Sites, Integer> {

}
