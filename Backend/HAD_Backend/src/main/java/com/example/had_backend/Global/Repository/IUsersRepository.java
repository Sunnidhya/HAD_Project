package com.example.had_backend.Global.Repository;

import com.example.had_backend.Global.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface IUsersRepository extends JpaRepository<Users, Serializable> {
    @Query("SELECT e FROM Users e where e.userName = :username AND e.password = :password")
    Users findByUserNameAndPassword(@Param("username") String userName, @Param("password") String password);


    @Query("SELECT u FROM Users u where u.userName = :username")
    Users getProfile(@Param("username") String userName);
}