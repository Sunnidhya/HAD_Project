package com.example.had_backend.Lab.Repository;

import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Lab.Entity.Labl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

public interface ILabLoginRepository extends JpaRepository<Labl, Serializable> {

    @Query("SELECT e FROM Labl e where e.userName = :username AND e.password = :password")
    Labl findByEmailAndPassword(@Param("username") String userName, @Param("password") String password);

    @Transactional
    @Modifying
    @Query("update Labl u set u.password = :password where u.userName = :username")
    void changePassword(@Param("username") String userName, @Param("password") String password);
}
