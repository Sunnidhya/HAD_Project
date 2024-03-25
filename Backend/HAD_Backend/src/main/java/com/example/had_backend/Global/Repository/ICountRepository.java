package com.example.had_backend.Global.Repository;

import com.example.had_backend.Global.Entity.UserName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;

public interface ICountRepository extends JpaRepository<UserName, Serializable>
{       @Query("SELECT r FROM UserName r where r.userName = :username")
        UserName getProfile(@Param("username") String userName);

}
