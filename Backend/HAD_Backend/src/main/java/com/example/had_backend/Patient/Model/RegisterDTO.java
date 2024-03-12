package com.example.had_backend.Patient.Model;

import lombok.Data;

@Data
public class RegisterDTO {
    String userName;
    String password;
    String fullName;
    String address;
    String email;
    String contactNo;

}
