package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Global.Model.RadioDTO;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Entity
@Getter
@Setter
@Table(name = "consent")
public class Consent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consent_id")
    private Integer consentId;

    @Column(nullable = true)
    private Integer labId;

    @Column(nullable = true)
    private Boolean labConsent = false;

    @ElementCollection
    @CollectionTable(name = "consent_radio_dto", joinColumns = @JoinColumn(name = "consent_id"))
    private List<RadioDTO> radioDTOS;
}
