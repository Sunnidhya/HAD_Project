package com.example.had_backend.Doctor.Repository;

import com.example.had_backend.Doctor.Entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.List;

public interface IDoctorRegistrationRepository extends JpaRepository<Doctor, Serializable> {

    @Query("SELECT r FROM Doctor r where r.userName = :username")
    Doctor getProfile(@Param("username") String userName);

    @Query("SELECT r FROM Doctor r where r.userName = :username OR r.email=:email")
    Doctor getDoctor(@Param("username") String userName, @Param("email") String email);


    @Query("delete from Doctor d where d.userId = :id")
    @Transactional
    @Modifying
    void removeEntry(@Param("id") Integer doctorId);

    @Query("SELECT d from Doctor d")
    List<Doctor> getCountDoctors();

    @Query("SELECT d from Doctor d where d.userId =:doctorIdVal")
    Doctor findByDoctorId(@Param("doctorIdVal") Integer doctorId);

    @Query("SELECT d from Doctor d where d.userName =:doctorUserNameVal")
    Doctor findByDoctorUserName(@Param("doctorUserNameVal") String doctorUserName);
}