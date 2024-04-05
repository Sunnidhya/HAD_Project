package com.example.had_backend.Global.Entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalDiagnosis {
    @NonNull
    private String name;

    @NonNull
    private String age;

    @NonNull
    private String status;

    @NonNull
    private String medicalHistory;

    @NonNull
    private String conclusion;

    @NonNull
    private String treatmentRecommendations;

    @NonNull
    private String surgery;

    @NonNull
    private  String therapy;

    @NonNull
    private String radiologistName;

    @NonNull
    private String radiologistConclusion;
}
