package com.example.had_backend.Patient.Repository;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Patient.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface IPatientRegistrationRepository extends JpaRepository<Patient, Serializable> {

    @Query("SELECT r FROM Patient r where r.userName = :username OR r.email=:email")
    Patient getPatientProfile(@Param("username") String userName,@Param("email")String email);

    @Query("SELECT r FROM Patient r where r.userName = :username")
    Patient getPatientProfileDetails(@Param("username") String userName);

}
