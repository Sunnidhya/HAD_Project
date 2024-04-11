package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
@Table(name = "threads")
public class Threads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer threadId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = true)
    private String text;

    @Column(nullable = true)
    private String imageURL;

    @Column(nullable = false)
    private String timeStamp;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chats chats;
}
