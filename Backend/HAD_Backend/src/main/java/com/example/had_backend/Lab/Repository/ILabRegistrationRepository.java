package com.example.had_backend.Lab.Repository;

import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Entity.Labl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

public interface ILabRegistrationRepository  extends JpaRepository<Lab, Serializable> {

    @Query("SELECT r FROM Lab r where r.userName = :username OR r.email=:email" )
    Lab getLab(@Param("username") String userName,@Param("email") String email);

    @Query("SELECT r FROM Lab r where r.userName = :username")
    Lab getProfile(@Param("username") String userName);

    @Query("delete from Lab d where d.labId = :id")
    @Transactional
    @Modifying
    void removeEntry(@Param("id") Integer labId);
}
