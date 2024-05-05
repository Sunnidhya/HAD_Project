package com.example.had_backend.Global.Model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RadioDTO {
    private Integer radioId;
    private String radioName;
    private Boolean radioConsent;
    private String radioImpression;
}
