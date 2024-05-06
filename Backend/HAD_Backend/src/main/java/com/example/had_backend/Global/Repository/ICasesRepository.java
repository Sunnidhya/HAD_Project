package com.example.had_backend.Global.Repository;

import com.example.had_backend.Global.Entity.Cases;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;
import java.util.List;

public interface ICasesRepository extends JpaRepository<Cases, Serializable> {

    @Query("select c from Cases c where c.caseName LIKE %:searchString%")
    List<Cases> getCases(@Param("searchString") String searchResult);

    @Query("select c from Cases c where c.doctor.userName = :userName")
    List<Cases> getAllCasesDoctor(@Param("userName") String searchResult);

    @Query("select c from Cases c")// where c.radiologist.userName = :userName
    List<Cases> getAllCasesRadiologist(@Param("userName") String searchResult);

    @Query("select c from Cases c where c.lab.userName = :userName")
    List<Cases> getAllCasesLab(@Param("userName") String searchResult);

    @Query("select c from Cases c where c.patient.userName = :userName")
    List<Cases> getAllCasesPatient(@Param("userName") String searchResult);

    @Query("select c from Cases c where c.caseId = :caseIdVal")
    Cases getCaseByCaseId(@Param("caseIdVal") Integer casesDTO);
}