package com.example.had_backend.Global.Model;

import lombok.Data;

@Data
public class UploadImagesDTO {
    private Integer caseId;
    private String patientUserName;
    private String prescriptionURL;
    private String scannedImageURL;
}
