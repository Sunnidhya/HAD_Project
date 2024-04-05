package com.example.had_backend.Patient.Repository;

import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

public interface IPatientRegistrationRepository extends JpaRepository<Patient, Serializable> {

    @Query("SELECT r FROM Patient r where r.userName = :username OR r.email=:email")
    Patient getPatientProfile(@Param("username") String userName,@Param("email")String email);

    @Query("SELECT r FROM Patient r where r.userName = :username")
    Patient getPatientProfileDetails(@Param("username") String userName);


    @Query("delete from Patient p where p.userId = :id")
    @Transactional
    @Modifying
    void removeEntry(@Param("id") Integer patientId);

    @Query("SELECT p from Patient p")
    List<Patient> getCountPatient();

    @Query("SELECT p from Patient p where p.userId =:patientIdVal")
    Patient findByPatientId(@Param("patientIdVal") Integer patientId);

    @Query("SELECT p from Patient p where p.userName =:patientUserNameVal")
    Patient findByPatientUserName(@Param("patientUserNameVal") String patientUserName);
}
