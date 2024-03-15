package com.example.had_backend.Patient.Model;


import lombok.Data;

@Data
public class PatientChangePasswordDTO {
    String userName;
    String currentPassword;
    String newPassword;
    String email;
}
