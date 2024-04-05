package com.example.had_backend.Global.Entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "imageob")
public class ImageOb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "case_image_id")
    private Integer caseImageId;

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
