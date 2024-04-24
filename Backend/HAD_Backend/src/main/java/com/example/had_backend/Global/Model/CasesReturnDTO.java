package com.example.had_backend.Global.Model;

import lombok.Data;

import java.util.List;

@Data
public class CasesReturnDTO {
    private String caseName;
    private Long caseDate;
    private Integer caseId;
    private String doctorName;
    private String labName;
    private String radioName;
    private String patientName;
    private String caseDescription;
    private Boolean markAsDone;
    private List<RadioDTO> radioDTOList;
}
