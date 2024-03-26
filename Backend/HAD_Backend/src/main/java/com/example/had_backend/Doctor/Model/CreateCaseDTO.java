package com.example.had_backend.Doctor.Model;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class CreateCaseDTO {
    String caseName;

    String caseDate;

    Doctor doctor;

    Lab lab;

    Radiologist radiologist;

    Patient patient;
}
