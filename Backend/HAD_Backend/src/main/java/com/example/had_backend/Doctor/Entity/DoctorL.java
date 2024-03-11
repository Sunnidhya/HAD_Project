package com.example.had_backend.Doctor.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "DoctorL")
public class DoctorL {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer doctorId;

    @Column(nullable = false)
    private String userName;

    private String password;

    private boolean loggedIn;

//    @OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "id", referencedColumnName = "doctorId")
//    private DoctorL doctorL;
}
