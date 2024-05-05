package com.example.had_backend.Global.Repository;

import com.example.had_backend.Global.Entity.Threads;
import com.example.had_backend.Global.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface IThreadRepository extends JpaRepository<Threads, Serializable> {}