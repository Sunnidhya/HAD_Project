package com.example.had_backend.Global.Model;

import lombok.Data;

@Data
public class CasesChatDTO {
    private Integer caseId;
    private Integer radioId;
    private String userName;
    private String text;
    private String image;
    private String timestamp;
}
