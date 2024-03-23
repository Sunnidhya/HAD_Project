package com.example.had_backend.GlobalEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "Doctor")
public class UserName {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true,nullable = false)
    private String userName;


//    @OneToOne(mappedBy = "DoctorL")
//    private Doctor doctor;
}
