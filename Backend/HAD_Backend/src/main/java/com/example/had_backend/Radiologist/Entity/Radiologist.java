package com.example.had_backend.Radiologist.Entity;

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
@Table(name = "radiologist")
public class Radiologist extends Users{
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String degree;

    @Column(nullable = false)
    private String specialization;

    @Column(unique = true,nullable = false)
    private String email;

    @Column(nullable = false)
    private String department;

    @OneToMany(mappedBy = "radiologist")
    @JsonIgnore
    private List<Cases> cases;
}
