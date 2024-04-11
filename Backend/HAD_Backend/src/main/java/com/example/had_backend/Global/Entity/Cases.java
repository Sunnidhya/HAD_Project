package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ref_chat_id", referencedColumnName = "chat_id")
    private Chats chats;

    @Column(nullable = true)
    @Embedded
    private ImageOb imageOb;

    private Boolean markAsDone=false;

    private String caseDescription="No description to show";
}
