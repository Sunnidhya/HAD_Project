package com.example.had_backend.Doctor.Entity;

import com.example.had_backend.Global.Entity.Cases;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Entity
@Getter
@Setter
@Table(name = "doctor")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer doctorId;

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

    @OneToOne(mappedBy = "doctor")
    @JsonIgnore
    private DoctorL doctorL;

    @OneToMany(mappedBy = "doctor")
    @JsonIgnore
    private List<Cases> cases;
}
