package com.example.had_backend.Global.Repository;

import com.example.had_backend.Global.Entity.Chats;
import com.example.had_backend.Global.Entity.Threads;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.Serializable;

public interface IChatRepository extends JpaRepository<Chats, Serializable> {

}