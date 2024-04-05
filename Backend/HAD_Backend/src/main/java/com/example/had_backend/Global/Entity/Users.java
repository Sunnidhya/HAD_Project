package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.lang.Nullable;


@Entity
@Data
@Table(name = "user")
@Inheritance(strategy = InheritanceType.JOINED)
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false,unique = true)
    private String userName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = true)
    @Embedded
    private OTP otp;
}
