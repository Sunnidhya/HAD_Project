package com.example.had_backend.Doctor.Model;

import lombok.Data;

@Data
public class DoctorRegistrationDTO {
    String name;
    String degree;
    String specialization;
    String email;
    String userName;
    String dept;
    String password;
}
