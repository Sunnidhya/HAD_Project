package com.example.had_backend.Doctor.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "doctorL")
public class DoctorL {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,unique = true)
    private Integer doctorId;

    @Column(nullable = false,unique = true)
    private String userName;

    @Column(nullable = false)
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "refDocId", referencedColumnName = "id",nullable = false,unique = true)
    private Doctor doctor;
}
