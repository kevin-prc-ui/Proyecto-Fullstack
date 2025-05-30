package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.ArchivoDto;
import com.webserdi.backend.mapper.ArchivoMapper;
import com.webserdi.backend.repository.ArchivoRepository;
import com.webserdi.backend.repository.CarpetaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional
public class ArchivoServiceImpl {

    private final ArchivoRepository archivoRepository;
    private final ArchivoMapper archivoMapper;
    private final CarpetaRepository carpetaRepository;

    @Override
    public ArchivoDto
}
