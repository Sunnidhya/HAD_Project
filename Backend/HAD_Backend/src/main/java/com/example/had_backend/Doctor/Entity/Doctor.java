package com.example.had_backend.Doctor.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer doctorId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String degree;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String department;

//    @OneToOne(mappedBy = "DoctorL")
//    private Doctor doctor;
}
