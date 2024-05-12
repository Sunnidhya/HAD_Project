package com.example.had_backend.Lab.Model;

import com.example.had_backend.Global.Entity.OTP;
import lombok.Data;

@Data
public class LabSendOTPDTO {
    String email;
    OTP otp;
}




