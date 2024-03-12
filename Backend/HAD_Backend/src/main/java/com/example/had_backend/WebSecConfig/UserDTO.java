package com.example.had_backend.WebSecConfig;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class UserDTO {

    private Integer id;

    private Integer patientId;

    private String userName;

    private String password;

    private boolean loggedIn;

    private String token;

}
