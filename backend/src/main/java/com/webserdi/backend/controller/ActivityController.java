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

    // 👉 Guarda una nueva actividad (junto con items, asignados y revisores)
    @PostMapping("/save")
    public ResponseEntity<?> saveActivity(@RequestBody ActivityRequest request) {
        // Convierte el DTO recibido (ActivityRequest) en una entidad Activity
        Activity activity = request.toEntity();

        // Llama al servicio para guardar la actividad con todos los detalles relacionados
        Activity saved = activityService.saveActivity(
                activity,
                request.getItems(),
                request.getAssignees(),
                request.getReviewers()
        );

        // Retorna la actividad guardada
        return ResponseEntity.ok(saved);
    }

    // 👉 Obtiene todas las actividades registradas
    @GetMapping("/")
    public ResponseEntity<?> getAllActivities() {
        List<Activity> activities = activityService.getAllActivities();

        // Retorna la lista completa de actividades
        return ResponseEntity.ok(activities);
    }

    // 👉 Obtiene una actividad específica por su ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable Integer id) {
        Activity activity = activityService.getActivityById(id);

        // Si existe la actividad, la retorna; si no, devuelve 404 Not Found
        if (activity != null) {
            return ResponseEntity.ok(activity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 👉 Filtra actividades por tipo y/o prioridad (parámetros opcionales)
    @GetMapping("/filter")
    public ResponseEntity<?> getFilteredActivities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String priority) {

        // Obtiene las actividades filtradas según los criterios enviados
        List<Activity> activities = activityService.getFilteredActivities(type, priority);

        // Retorna las actividades que cumplen los filtros
        return ResponseEntity.ok(activities);
    }
}
