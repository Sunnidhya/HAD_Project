package com.example.had_backend.Patient.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "PatientL")
public class PatientL {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private Integer patientId;

    @Column(nullable = false, unique = true)
    private String userName;

    private String password;
}
