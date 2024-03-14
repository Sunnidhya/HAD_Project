package com.example.had_backend.Patient.Service;


import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Model.RegisterDTO;
import com.example.had_backend.Patient.Repository.IPatientLoginRepository;
import com.example.had_backend.Patient.Repository.IPatientRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    @Autowired
    private IPatientLoginRepository iPatientLoginRepository;
    @Autowired
    private IPatientRegistrationRepository iPatientRegistrationRepository;


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

    public Patient registerPatient(RegisterDTO register) {
//        iPatientLoginRepository.registerPatient(register.getAddress(),register.getContactNo(), register.getFullName(), register.getEmail(), register.getPassword(), register.getUserName());
        var add = register.getAddress();
        var contact = register.getContactNo();
        var fullname = register.getFullName();
        var email = register.getEmail();
        var password = register.getPassword();
        var username = register.getUserName();
        Patient patient = new Patient();
        patient.setAddress(add);
        patient.setContactNo(contact);
        patient.setEmail(email);
        patient.setFullName(fullname);
        patient.setPassword(password);
        patient.setUserName(username);
        return iPatientRegistrationRepository.save(patient);


    }

}
