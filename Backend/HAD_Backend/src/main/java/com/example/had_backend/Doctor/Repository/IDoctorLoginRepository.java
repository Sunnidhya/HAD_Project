package com.example.had_backend.Doctor.Repository;

import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Patient.Entity.PatientL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

public interface IDoctorLoginRepository extends JpaRepository<DoctorL, Serializable> {
    @Query("SELECT e FROM DoctorL e where e.userName = :username AND e.password = :password")
    DoctorL findByEmailAndPassword(@Param("username") String userName, @Param("password") String password);

    @Transactional
    @Modifying
    @Query("update DoctorL u set u.password = :password where u.userName = :username")
    void changePassword(@Param("username") String userName, @Param("password") String password);

    @Transactional
    @Modifying
    @Query("update DoctorL u set u.doctor = null where u.doctor.doctorId = :id")
    void updateAndSetDocIdNull(@Param("id") Integer doctorId);
}