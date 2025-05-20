package com.webserdi.backend.controller;

import com.webserdi.backend.dto.ActivityDto;
import com.webserdi.backend.entity.Activity;
import com.webserdi.backend.service.impl.ActivityServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityServiceImpl activityServiceImpl;


    // 👉 Guarda una nueva actividad (junto con items, asignados y revisores)
    @PostMapping("/save")
    public ResponseEntity<?> saveActivity(@RequestBody ActivityDto request) {
        // Convierte el DTO recibido (ActivityDto) en una entidad Activity

        // Llama al servicio para guardar la actividad con todos los detalles relacionados
        ActivityDto saved = activityServiceImpl.saveActivity(request);

        // Retorna la actividad guardada
        return ResponseEntity.ok(saved);
    }

    // 👉 Obtiene todas las actividades registradas
    @GetMapping("/")    
    public ResponseEntity<?> getAllActivities() {
        List<Activity> activities = activityServiceImpl.getAllActivities();

        // Retorna la lista completa de actividades
        return ResponseEntity.ok(activities);
    }

    // 👉 Obtiene una actividad específica por su ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable Long id) {
        Activity activity = activityServiceImpl.getActivityById(id);

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
        List<Activity> activities = activityServiceImpl.getFilteredActivities(type, priority);

        // Retorna las actividades que cumplen los filtros
        return ResponseEntity.ok(activities);
    }
}
