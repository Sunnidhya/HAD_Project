package com.example.demo.Repository;

import com.example.demo.Entity.PatientL;
import com.example.demo.Model.LoginDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface IPatientLoginRepository extends JpaRepository<PatientL, Serializable> {
    @Query("SELECT e FROM PatientL e where e.userName = :username AND e.password = :password")
    PatientL findByEmailAndPassword(@Param("username") String userName, @Param("password") String password);
}