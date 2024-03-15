package com.example.had_backend.Radiologist.Model;

import lombok.Data;

@Data
public class RadiologistChangePasswordDTO {
    String userName;
    String currentPassword;
    String newPassword;
    String email;
}
