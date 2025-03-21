package com.webserdi.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ActivitiesControllerK {

    @GetMapping("/activities")
    public String activities() {

        return "Actividades Diarias";
    }
}
