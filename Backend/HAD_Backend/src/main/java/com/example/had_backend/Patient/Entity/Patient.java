package com.example.had_backend.Patient.Entity;

import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "patient")
public class Patient extends Users{
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String contactNo;

    @OneToMany(mappedBy = "patient")
    @JsonIgnore
    private List<Cases> cases;
}
