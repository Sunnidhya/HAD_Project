package com.example.had_backend.Patient.Service;

import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Patient.Entity.PatientRegister;
import com.example.had_backend.Patient.Model.RegisterDTO;
import com.example.had_backend.Patient.Repository.IPatientLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    @Autowired
    private IPatientLoginRepository iPatientLoginRepository;

    public PatientL authenticate(LoginDTO loginDTO) {
        PatientL patientL = new PatientL();
        try {
            patientL = iPatientLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return patientL;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return patientL;
    }

    public void registerPatient(RegisterDTO register) {
        iPatientLoginRepository.registerPatient(register.getAddress(),register.getContactNo(), register.getFullName(), register.getEmail(), register.getPassword(), register.getUserName());
    }
}
