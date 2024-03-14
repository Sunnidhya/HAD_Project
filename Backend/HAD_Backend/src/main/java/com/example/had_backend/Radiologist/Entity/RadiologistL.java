package com.example.had_backend.Radiologist.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "RadiologistL")
public class RadiologistL {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false,unique = true)
    private Integer radiologistId;

    @Column(nullable = false,unique = true)
    private String userName;

    private String password;
}
