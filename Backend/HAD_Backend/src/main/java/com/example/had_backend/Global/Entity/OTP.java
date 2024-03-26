package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.Date;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "OTP")
public class OTP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NonNull
    private Long id;
    @NonNull
    private Integer oneTimePasswordCode;
    @NonNull
    private Long expires;
}
