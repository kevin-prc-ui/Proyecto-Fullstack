package com.webserdi.backend.mapper;

import com.webserdi.backend.dto.ActivityDto;
import com.webserdi.backend.entity.Activity;
import com.webserdi.backend.entity.Item; // Assuming Item entity is in this package and has a getName() method

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ActivityMapper {

    /**
     * Converts an {@link ActivityDto} to an {@link Activity} entity.
     * Handles specific logic for fields like 'approvalPercentage', 'createdAt', and 'updatedAt'
     * similarly to the original ActivityDto.toEntity() method.
     * Related entities (Usuario, Item list) are expected to be set by the service layer.
     *
     * @param activityDto The DTO to convert.
     * @return The resulting Activity entity, or null if the input DTO is null.
     */
    public Activity toEntity(ActivityDto activityDto) {
        if (activityDto == null) {
            return null;
        }

        Activity activity = new Activity();
        activity.setId(activityDto.getId());
        activity.setName(activityDto.getName());
        activity.setType(activityDto.getType());
        activity.setDueDate(activityDto.getDueDate());
        activity.setPriority(activityDto.getPriority());
        activity.setDescription(activityDto.getDescription());
        activity.setSendNotifications(activityDto.getSendNotifications());

        // Set approvalPercentage only if type is "workflow"
        if ("workflow".equals(activityDto.getType())) {
            activity.setApprovalPercentage(activityDto.getApprovalPercentage());
        } else {
            activity.setApprovalPercentage(null);
        }

        // Set updatedAt to the current time
        activity.setUpdatedAt(LocalDateTime.now());

        // Set createdAt to the current time if it's a new activity (ID is null)
        // For updates, createdAt is assumed to be already set on the persistent entity
        // and should not be changed here.
        if (activityDto.getId() == null) {
            activity.setCreatedAt(LocalDateTime.now());
        } else {
            // If updating an existing entity, createdAt is typically preserved.
            // If the DTO is meant to carry the original createdAt for updates, you could set it:
            // activity.setCreatedAt(activityDto.getCreatedAt());
            // However, the logic from ActivityDto.toEntity() implies createdAt is not set from DTO during an update.
        }

        // Note: Mapping for 'usuarioCreador', 'usuarioAsignado' (as Usuario objects)
        // and 'items' (as List<Item>) is typically handled in the service layer.
        // The service would use IDs from ActivityDto (e.g., activityDto.getUsuarioCreadorId())
        // to fetch/create and set these relationships.

        return activity;
    }

    /**
     * Converts an {@link Activity} entity to an {@link ActivityDto}.
     *
     * @param activity The entity to convert.
     * @return The resulting ActivityDto, or null if the input entity is null.
     */
    public ActivityDto toDto(Activity activity) {
        if (activity == null) {
            return null;
        }

        ActivityDto activityDto = new ActivityDto();
        activityDto.setId(activity.getId());
        activityDto.setName(activity.getName());
        activityDto.setType(activity.getType());
        activityDto.setDueDate(activity.getDueDate());
        activityDto.setPriority(activity.getPriority());
        activityDto.setDescription(activity.getDescription());
        activityDto.setSendNotifications(activity.getSendNotifications());
        activityDto.setApprovalPercentage(activity.getApprovalPercentage());
        activityDto.setCreatedAt(activity.getCreatedAt());
        activityDto.setUpdatedAt(activity.getUpdatedAt());

        // Map Usuario IDs
        if (activity.getUsuarioCreador() != null) {
            activityDto.setUsuariosCreadores(activity.getUsuarioCreador().getId());
        }
        if (activity.getUsuarioAsignado() != null) {
            activityDto.setUsuariosAsignados(List.of(activity.getUsuarioAsignado().getId()));
        }

        // Map List<Item> to List<String>
        // This assumes your Item entity has a method like getName() or similar
        // to get its string representation, similar to Permiso::getNombre in RolMapper.
        if (activity.getItems() != null) {
            activityDto.setItems(activity.getItems().stream()
                    .map(Item::getName) // Or item -> item.getSomeStringField(), or item.toString()
                    // Ensure Item.java has a getName() method or adapt this line.
                    .collect(Collectors.toList()));
        } else {
            activityDto.setItems(new ArrayList<>()); // Or set to null, depending on desired DTO structure
        }

        return activityDto; // Corrected: return the populated DTO
    }
}