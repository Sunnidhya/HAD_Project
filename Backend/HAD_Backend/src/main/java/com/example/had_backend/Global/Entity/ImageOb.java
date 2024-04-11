package com.example.had_backend.Global.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageOb {
    @NonNull
    private String prescriptionURL;

    @NonNull
    private String reportURL;

    @NonNull
    private String scannedImageURL;

    @Embedded
    @NonNull
    private FinalDiagnosis finalDiagnosis;
}
