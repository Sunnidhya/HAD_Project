package com.example.had_backend.Global.Model;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import lombok.Data;

@Data
public class OtpDTO {
    Integer otp;
    String userName;
}
