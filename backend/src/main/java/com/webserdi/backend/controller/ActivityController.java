package com.webserdi.backend.controller;

import com.webserdi.backend.dto.ActivityRequest;
import com.webserdi.backend.entity.Activity;
import com.webserdi.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    // Endpoint para guardar una actividad
    @PostMapping("/save")
    public ResponseEntity<?> saveActivity(@RequestBody ActivityRequest request) {
        Activity activity = request.toEntity();
        Activity saved = activityService.saveActivity(
                activity,
                request.getItems(),
                request.getAssignees(),
                request.getReviewers()
        );
        return ResponseEntity.ok(saved);
    }

    // Endpoint para obtener todas las actividades
    @GetMapping("/")
    public ResponseEntity<?> getAllActivities() {
        List<Activity> activities = activityService.getAllActivities();
        return ResponseEntity.ok(activities); // Devuelve todas las actividades
    }
}
