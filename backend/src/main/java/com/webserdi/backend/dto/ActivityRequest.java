package com.webserdi.backend.dto;

import com.webserdi.backend.entity.Activity;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActivityRequest {
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

    public Activity toEntity() {
        Activity activity = new Activity();
        activity.setId(id);
        activity.setName(name);
        activity.setType(type);
        activity.setDueDate(dueDate);
        activity.setPriority(priority);
        activity.setDescription(description);
        activity.setSendNotifications(sendNotifications);
        activity.setApprovalPercentage("workflow".equals(type) ? approvalPercentage : null);
        activity.setUpdatedAt(LocalDateTime.now());
        if (id == null) {
            activity.setCreatedAt(LocalDateTime.now());
        }
        return activity;
    }
}
