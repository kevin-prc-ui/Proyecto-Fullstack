package com.webserdi.backend.service;

import com.webserdi.backend.entity.Activity;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.entity.Item;
import com.webserdi.backend.repository.ActivityRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional // 👉 Garantiza que las operaciones sobre Activity y sus relaciones se hagan en una sola transacción
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepo;

    @Autowired
    private UsuarioRepository UsuarioRepo;

    // 👉 Guarda o actualiza una actividad junto con items, assignees y reviewers
    public Activity saveActivity(Activity activity, List<String> itemNames, Long assigneeIds, Long reviewerIds) {
        // 👉 Asegura que las listas estén inicializadas para evitar NullPointer
        if (activity.getItems() == null) activity.setItems(new ArrayList<>());

        // 👉 Limpia listas antes de agregar (importante para updates)
        activity.getItems().clear();
        activity.setUsuarioCreador(null);
        activity.setUsuarioAsignado(null);

        // 👉 Agrega Items a la actividad
        for (String itemName : itemNames) {
            Item item = new Item();
            item.setName(itemName);
            item.setActivity(activity);
            activity.getItems().add(item);
        }

        // 👉 Agrega Assignees a la actividad
        Usuario assignees = UsuarioRepo.findById(assigneeIds)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 👉 Solo si es tipo "workflow", agrega reviewers
        if ("workflow".equals(activity.getType())) {
            Usuario reviewers = UsuarioRepo.findById(reviewerIds)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        }

        // 👉 Guarda la actividad (con cascade se guardan también los items)
        return activityRepo.save(activity);
    }

    // 👉 Devuelve todas las actividades
    public List<Activity> getAllActivities() {
        return activityRepo.findAll();
    }

    // 👉 Devuelve una actividad por ID (o null si no existe)
    public Activity getActivityById(Integer id) {
        return activityRepo.findById(id).orElse(null);
    }

    // 👉 Filtra actividades por type y/o priority
    public List<Activity> getFilteredActivities(String type, String priority) {
        if (type != null && priority != null) {
            return activityRepo.findByTypeAndPriority(type, priority);
        } else if (type != null) {
            return activityRepo.findByType(type);
        } else if (priority != null) {
            return activityRepo.findByPriority(priority);
        } else {
            return activityRepo.findAll();
        }
    }
}
