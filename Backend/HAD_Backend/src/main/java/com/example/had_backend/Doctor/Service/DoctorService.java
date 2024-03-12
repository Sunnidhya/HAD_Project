package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Repository.IDoctorLoginRepository;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Repository.IPatientLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.print.Doc;

@Service
public class DoctorService {
    @Autowired
    private IDoctorLoginRepository iDoctorLoginRepository;

    public DoctorL authenticate(LoginDTO loginDTO) {
        DoctorL doctorL = new DoctorL();
        try {
            doctorL = iDoctorLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return doctorL;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return doctorL;
    }
}
