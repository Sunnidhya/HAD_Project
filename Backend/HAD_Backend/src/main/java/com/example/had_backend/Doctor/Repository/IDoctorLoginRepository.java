package com.example.had_backend.Doctor.Repository;

import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Patient.Entity.PatientL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface IDoctorLoginRepository extends JpaRepository<DoctorL, Serializable> {
    @Query("SELECT e FROM DoctorL e where e.userName = :username AND e.password = :password")
    DoctorL findByEmailAndPassword(@Param("username") String userName, @Param("password") String password);
}