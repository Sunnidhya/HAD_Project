package com.example.had_backend.Global.Repository;

import com.example.had_backend.Global.Entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.io.Serializable;

public interface IConsentRepository extends JpaRepository<Consent, Serializable> {
}