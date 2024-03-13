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

    public PatientRegister registerPatient(RegisterDTO register) {
//        iPatientLoginRepository.registerPatient(register.getAddress(),register.getContactNo(), register.getFullName(), register.getEmail(), register.getPassword(), register.getUserName());
        var add = register.getAddress();
        var contact = register.getContactNo();
        var fullname = register.getFullName();
        var email = register.getEmail();
        var password = register.getPassword();
        var username = register.getUserName();
        PatientRegister patientRegister = new PatientRegister();
        patientRegister.setAddress(add);
        patientRegister.setContactNo(contact);
        patientRegister.setEmail(email);
        patientRegister.setFullName(fullname);
        patientRegister.setPassword(password);
        patientRegister.setUserName(username);
        //iPatLoginRepository.saveAndFlush(patientRegister)
        return patientRegister;

    }
}
