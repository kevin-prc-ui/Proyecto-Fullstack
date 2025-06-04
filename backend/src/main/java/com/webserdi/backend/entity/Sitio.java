package com.webserdi.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sites")
public class Sitio {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long siteId;
    private String name;
    private String description;
    private String type;
    private String visibility;


}
