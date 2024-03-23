package com.example.had_backend.Patient.Entity;

import com.example.had_backend.Global.Entity.Cases;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patientId")
    private Integer patientId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String contactNo;

    @OneToOne(mappedBy = "patient")
    @JsonIgnore
    private PatientL patientL;

    @OneToMany(mappedBy = "patient")
    @JsonIgnore
    private List<Cases> cases;

}
