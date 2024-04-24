package com.example.had_backend.Global.Model;

import lombok.Data;

@Data
public class CasesNewRadioDTO {
    private Integer caseId;
    private Integer radiologistId;
    private Boolean consent;
}
