package com.example.had_backend.Lab.Model;

import lombok.Data;

@Data
public class LabChangePasswordDTO {
    String userName;
    String currentPassword;
    String newPassword;
    String email;
}




