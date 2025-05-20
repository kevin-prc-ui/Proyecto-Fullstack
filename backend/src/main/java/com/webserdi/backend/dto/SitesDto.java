package com.webserdi.backend.dto;

import lombok.Data;

@Data
public class SitesDto {
    private Long siteId;
    private String name;
    private String description;
    private String type;
    private String visibility;
    
}
