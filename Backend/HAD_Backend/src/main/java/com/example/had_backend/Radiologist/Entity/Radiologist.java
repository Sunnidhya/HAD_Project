package com.example.had_backend.Radiologist.Entity;

import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.GlobalEntity.Cases;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "radiologist")
public class Radiologist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "radiologistId")
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

    @OneToOne(mappedBy = "radiologist")
    private RadiologistL radiologistL;

    @OneToMany(mappedBy = "radiologist")
    @JsonIgnore
    private List<Cases> cases;

}
