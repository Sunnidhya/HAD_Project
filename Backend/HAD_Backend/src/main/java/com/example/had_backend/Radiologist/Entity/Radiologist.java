package com.example.had_backend.Radiologist.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Radiologist")
public class Radiologist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer radiologistId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String degree;

    @Column(nullable = false)
    private String specialization;

    @Column(unique = true,nullable = false)
    private String email;

    @Column(unique = true,nullable = false)
    private String userName;

    @Column(nullable = false)
    private String department;

}
