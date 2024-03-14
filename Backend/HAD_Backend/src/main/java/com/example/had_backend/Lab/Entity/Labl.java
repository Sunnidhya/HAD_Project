package com.example.had_backend.Lab.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "Labl")
public class Labl {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private Integer labId;

    @Column(nullable = false, unique = true)
    private String userName;

    private String password;
}
