package com.example.had_backend.Patient.Repository;

import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Patient.Entity.PatientRegister;
import com.example.had_backend.Patient.Model.RegisterDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

public interface IPatientLoginRepository extends JpaRepository<PatientL, Serializable> {
    @Query("SELECT e FROM PatientL e where e.userName = :username AND e.password = :password")
    PatientL findByEmailAndPassword(@Param("username") String userName, @Param("password") String password);

    PatientL findByUserName(String issuer);

    @Modifying
    @Transactional
    @Query(value = "insert into PatientRegister (address, contact_no, full_name, email, password, user_name) values (:address, :contactNo, :fullName, :email, :password, :userName)", nativeQuery = true)
    void registerPatient(@Param("address") String address, @Param("contactNo") String contactNo, @Param("fullName") String fullName, @Param("email") String email, @Param("password") String password, @Param("userName") String userName);


}