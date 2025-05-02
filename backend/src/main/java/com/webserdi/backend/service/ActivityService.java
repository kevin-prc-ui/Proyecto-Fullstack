package com.webserdi.backend.service;

import com.webserdi.backend.dto.DepartamentoDto;
import com.webserdi.backend.entity.Activity;
import com.webserdi.backend.entity.Item;
import com.webserdi.backend.entity.User;
import com.webserdi.backend.repository.ActivityRepository;
import com.webserdi.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepo;

    @Autowired
    private UserRepository userRepo;

    public Activity saveActivity(Activity activity, List<String> itemNames, List<Integer> assigneeIds, List<Integer> reviewerIds) {
        // Asegurar que las listas no sean null
        if (activity.getItems() == null) activity.setItems(new ArrayList<>());
        if (activity.getAssignees() == null) activity.setAssignees(new ArrayList<>());
        if (activity.getReviewers() == null) activity.setReviewers(new ArrayList<>());

        // Limpiar antes de volver a agregar
        activity.getItems().clear();
        activity.getAssignees().clear();
        activity.getReviewers().clear();

        // Agregar Items
        for (String itemName : itemNames) {
            Item item = new Item();
            item.setName(itemName);
            item.setActivity(activity);
            activity.getItems().add(item);
        }

        // Agregar Assignees
        List<User> assignees = userRepo.findAllById(assigneeIds);
        activity.getAssignees().addAll(assignees);

        // Agregar Reviewers solo si es workflow
        if ("workflow".equals(activity.getType())) {
            List<User> reviewers = userRepo.findAllById(reviewerIds);
            activity.getReviewers().addAll(reviewers);
        }

        // Guardar todo (cascade = ALL se encargará de items)
        return activityRepo.save(activity);

    }
}
