package com.example.had_backend.Lab.Entity;

import com.example.had_backend.Global.Entity.Cases;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Entity
@Getter
@Setter
@Table(name = "lab")
public class Lab {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "labId")
    private Integer labId;

    @Column(nullable = false)
    private String labName;

    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String contactNo;

    @OneToOne(mappedBy = "lab")
    @JsonIgnore
    private Labl labl;

    @OneToMany(mappedBy = "lab")
    @JsonIgnore
    private List<Cases> cases;
}
