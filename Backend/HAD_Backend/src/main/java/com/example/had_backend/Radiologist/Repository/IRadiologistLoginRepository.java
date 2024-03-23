package com.example.had_backend.Radiologist.Repository;

import com.example.had_backend.Radiologist.Entity.RadiologistL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

public interface IRadiologistLoginRepository extends JpaRepository<RadiologistL, Serializable> {
    @Query("SELECT e FROM RadiologistL e where e.userName = :username AND e.password = :password")
    RadiologistL findByEmailAndPassword(@Param("username") String userName, @Param("password") String password);

    @Transactional
    @Modifying
    @Query("update RadiologistL u set u.password = :password where u.userName = :username")
    void changePassword(@Param("username") String username, @Param("password") String newPassword);
}
