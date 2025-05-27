package com.webserdi.backend.dto;

import com.webserdi.backend.entity.Activity;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data // 👉 Genera automáticamente getters, setters, toString, equals y hashCode
public class ActivityDto {

    // 👉 Campos que representan los datos que se envían desde el cliente
    private Long id;
    private String name;
    private String type;
    private LocalDate dueDate;
    private String priority;
    private String description;
    private Boolean sendNotifications;
    private Integer approvalPercentage;
    private List<String> items;
    private Long usuariosCreadores;
    private List<Long> usuariosAsignados;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}