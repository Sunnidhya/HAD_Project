package com.example.had_backend.Global.Model;

import lombok.Data;

@Data
public class CasesDetailsDTO {
    private Integer caseId;
    private Long caseDate;
    private String caseDescription;
    private String caseName;
    private String age;
    private String conclusion;
    private String medicalHistory;
    private String radiologistConclusion;
    private String status;
    private String surgery;
    private String therapy;
    private String treatmentRecommendation;
    private String prescriptionURL;
    private String scannedImageURL;
    private String doctorName;
    private String labName;
    private String radioName;
    private String patientName;
    private Boolean markAsDone;
}
