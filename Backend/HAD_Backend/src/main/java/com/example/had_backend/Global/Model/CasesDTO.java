package com.example.had_backend.Global.Model;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NonNull;
import org.springframework.lang.Nullable;

@Data
public class CasesDTO {
    private String caseName;
    private Long caseDate;
    private Integer caseId;
    private String doctorName;
    private Integer labId;
    private Integer radiologistId;
    private String radioUserName;
    private String patientName;
    private String caseDescription;
}
