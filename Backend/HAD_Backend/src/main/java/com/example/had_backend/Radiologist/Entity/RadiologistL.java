package com.example.had_backend.Radiologist.Entity;

import com.example.had_backend.Patient.Entity.Patient;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "radiologistL")
public class RadiologistL {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,unique = true)
    private String userName;

    @Column(nullable = false)
    private String password;

    @OneToOne(cascade = CascadeType.ALL)
    @JsonIgnore
    @JoinColumn(name = "refRadId", referencedColumnName = "radiologistId",nullable = false,unique = true)
    private Radiologist radiologist;
}
