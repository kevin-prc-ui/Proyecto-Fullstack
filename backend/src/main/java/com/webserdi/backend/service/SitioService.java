package com.webserdi.backend.service;

import com.webserdi.backend.dto.SitioDto;
import java.util.List;

public interface SitioService {
    SitioDto crearSitio(SitioDto sitioDto);
    List<SitioDto> listarMisSitios(Long usuarioId);
    SitioDto obtenerPorSlug(String slug);
    void eliminarSitio(Long id);
    SitioDto actualizarSitio(Long id, SitioDto sitioDto);
}
