package com.example.had_backend.Global.Repository;


import com.example.had_backend.Global.Entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

public interface IOTPRepository extends JpaRepository<OTP, Serializable> {
    @Query("SELECT o from OTP o where o.oneTimePasswordCode=:otpValue")
    OTP getOTPValue(@Param("otpValue") Integer otp);

    @Query("delete from OTP o where o.oneTimePasswordCode = :otpV")
    @Transactional
    @Modifying
    void removeEntry(@Param("otpV") Integer otpVal);
}