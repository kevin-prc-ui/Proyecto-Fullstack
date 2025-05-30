package com.webserdi.backend.service;

import com.webserdi.backend.dto.ArchivoDto;

import java.util.List;

public interface ArchivoService {
    ArchivoDto createArchivo(ArchivoDto archivoDto);
    ArchivoDto getArchivo(Long ArchivoId);
    List<ArchivoDto> getAllCarpetas();
    ArchivoDto updateArchivo(Long archivoId, ArchivoDto archivoDto);
    void deleteArchivo(Long ArchivoId);
}
