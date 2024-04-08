package com.example.had_backend.Global.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageOb {
    @Column(nullable = true)
    private String prescriptionURL;

    @Column(nullable = true)
    private String reportURL;

    @Column(nullable = true)
    private String scannedImageURL;

    @Column(nullable = true)
    @Embedded
    private FinalDiagnosis finalDiagnosis;

    @OneToOne
    @JoinColumn(name = "case_id")
    private Cases cases;
}
