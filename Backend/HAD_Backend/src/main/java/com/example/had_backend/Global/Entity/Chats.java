package com.example.had_backend.Global.Entity;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@Table(name = "chats")
public class Chats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Integer chatId;

    @OneToMany(mappedBy = "chats", cascade = CascadeType.ALL)
    private List<Threads> threads = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "case_id")
    private Cases cases;
}
