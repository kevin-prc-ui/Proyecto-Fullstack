package com.webserdi.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SitioDto {
    private Long id;
    private String siteId;
    private String name;
    private String description;
    private String visibility;
    private String type;
    private Long creadorId;
    private List<Long> usuariosAsignados;
}
