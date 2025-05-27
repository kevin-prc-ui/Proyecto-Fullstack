package com.webserdi.backend.service.impl;

import com.webserdi.backend.dto.ActivityDto;
import com.webserdi.backend.entity.Activity;
import com.webserdi.backend.entity.Item;
import com.webserdi.backend.entity.Usuario;
import com.webserdi.backend.mapper.ActivityMapper;
import com.webserdi.backend.repository.ActivityRepository;
import com.webserdi.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityServiceImpl {

    @Autowired
    private ActivityRepository activityRepo;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ActivityMapper activityMapper;

    public ActivityDto saveActivity(ActivityDto dto) {
        Activity activity = activityMapper.toEntity(dto);

        // Limpia items antes de agregar (importante para updates)
        activity.getItems().clear();

        // Obtiene y asigna el usuario creador (no puede ser null)
        Usuario creador = usuarioRepository.findById(dto.getUsuariosCreadores())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));
        activity.setUsuarioCreador(creador);

        // Limpia usuarios asignados antes de asignar nuevos
        activity.setUsuarioAsignado(null);

        // Agrega Items a la actividad
        for (String itemName : dto.getItems()) {
            Item item = new Item();
            item.setName(itemName);
            item.setActivity(activity);
            activity.getItems().add(item);
        }

        // Agrega usuarios asignados
        List<Usuario> asignados = usuarioRepository.findAllById(dto.getUsuariosAsignados());
        activity.setUsuarioAsignado(asignados);

        // Guarda la actividad (con cascade se guardan los items)
        return activityMapper.toDto(activityRepo.save(activity));
    }

    public List<Activity> getAllActivities() {
        return activityRepo.findAll();
    }

    public Activity getActivityById(Long id) {
        return activityRepo.findById(id).orElse(null);
    }

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
