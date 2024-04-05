package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "cases")
public class Cases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer caseId;

    @Column(nullable = false)
    private String caseName;

    @Column(nullable = false)
    private Long caseDate;

    //doctorId of doctor table
    @ManyToOne
    @JoinColumn(name = "id", nullable = false, foreignKey = @ForeignKey(name="doctorId1"))
    @JsonIgnore
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "labId", nullable = true, foreignKey = @ForeignKey(name="labId"))
    @JsonIgnore
    private Lab lab;

    @ManyToOne
    @JoinColumn(name = "radioId", nullable = true, foreignKey = @ForeignKey(name="radiologistId"))
    @JsonIgnore
    private Radiologist radiologist;

    @ManyToOne
    @JoinColumn(name = "patientId", nullable = false, foreignKey = @ForeignKey(name="patientId"))
    @JsonIgnore
    private Patient patient;

    @OneToOne(mappedBy = "cases", cascade = CascadeType.ALL)
    private Chats chats;

    @OneToOne(mappedBy = "cases", cascade = CascadeType.ALL)
    private ImageOb imageOb;

    private Boolean markAsDone=false;
}
