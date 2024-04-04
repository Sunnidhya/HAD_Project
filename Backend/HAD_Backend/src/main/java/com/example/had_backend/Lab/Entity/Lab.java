package com.example.had_backend.Lab.Entity;

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
@Table(name = "lab")
public class Lab extends Users{
    @Column(nullable = false)
    private String labName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contactNo;

    @OneToMany(mappedBy = "lab")
    @JsonIgnore
    private List<Cases> cases;
}
