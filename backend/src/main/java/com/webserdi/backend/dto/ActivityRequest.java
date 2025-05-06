package com.webserdi.backend.dto;

import com.webserdi.backend.entity.Activity;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data // 👉 Genera automáticamente getters, setters, toString, equals y hashCode
public class ActivityRequest {

    // 👉 Campos que representan los datos que se envían desde el cliente
    private Integer id;
    private String name;
    private String type;
    private LocalDate dueDate;
    private String priority;
    private String description;
    private Boolean sendNotifications;
    private Integer approvalPercentage;
    private List<String> items;
    private List<Integer> assignees;
    private List<Integer> reviewers;

    // 👉 Convierte este DTO en una entidad Activity (para guardar en la base de datos)
    public Activity toEntity() {
        Activity activity = new Activity();
        activity.setId(id);
        activity.setName(name);
        activity.setType(type);
        activity.setDueDate(dueDate);
        activity.setPriority(priority);
        activity.setDescription(description);
        activity.setSendNotifications(sendNotifications);

        // 👉 Solo asigna approvalPercentage si el tipo es "workflow"
        activity.setApprovalPercentage("workflow".equals(type) ? approvalPercentage : null);

        // 👉 Actualiza siempre la fecha de modificación
        activity.setUpdatedAt(LocalDateTime.now());

        // 👉 Si es una nueva actividad (sin ID), establece la fecha de creación
        if (id == null) {
            activity.setCreatedAt(LocalDateTime.now());
        }

        return activity;
    }
}
