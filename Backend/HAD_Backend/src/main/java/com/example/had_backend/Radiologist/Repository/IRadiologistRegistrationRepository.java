package com.example.had_backend.Radiologist.Repository;

import com.example.had_backend.Radiologist.Entity.Radiologist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.io.Serializable;

public interface IRadiologistRegistrationRepository extends JpaRepository<Radiologist, Serializable> {
    @Query("SELECT r FROM Radiologist r where r.userName = :username OR r.email=:email" )
    Radiologist getRadiologist(@Param("username") String userName,@Param("email") String email);

    @Query("SELECT r FROM Radiologist r where r.userName = :username")
    Radiologist getProfile(@Param("username") String userName);
}
