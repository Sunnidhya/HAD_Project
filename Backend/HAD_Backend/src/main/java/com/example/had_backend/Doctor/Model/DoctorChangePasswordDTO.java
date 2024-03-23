package com.example.had_backend.Doctor.Model;


import lombok.Data;

@Data
public class DoctorChangePasswordDTO {
    String userName;
    String currentPassword;
    String newPassword;
    String email;
}
