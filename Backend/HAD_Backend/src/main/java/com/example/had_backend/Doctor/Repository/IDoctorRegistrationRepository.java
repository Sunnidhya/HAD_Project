package com.example.had_backend.Doctor.Repository;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface IDoctorRegistrationRepository extends JpaRepository<Doctor, Serializable> {

    @Query("SELECT r FROM Doctor r where r.userName = :username")
    Doctor getProfile(@Param("username") String userName);

    @Query("SELECT r FROM Doctor r where r.userName = :username OR r.email=:email" )
    Doctor getDoctor(@Param("username") String userName,@Param("email") String email);

}