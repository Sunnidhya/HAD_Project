package com.example.had_backend.Patient.Service;


import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Patient.Model.PatientChangePasswordDTO;
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

    public LoginMessage registerPatient(RegisterDTO register) {
        Patient patient = new Patient();
        PatientL patientL = new PatientL();
        Patient patient1=iPatientRegistrationRepository.getPatientProfile(register.getUserName(),register.getEmail());
        if (patient1 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        patient.setAddress(register.getAddress());
        patient.setContactNo(register.getContactNo());
        patient.setEmail(register.getEmail());
        patient.setFullName(register.getFullName());
        patient.setUserName(register.getUserName());
        iPatientRegistrationRepository.save(patient);

        Patient patient2=iPatientRegistrationRepository.getPatientProfile(register.getUserName(), register.getEmail());
        patientL.setPatientId(patient2.getPatientId());
        patientL.setUserName(register.getUserName());
        patientL.setPassword(register.getPassword());
        iPatientLoginRepository.save(patientL);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Patient getProfile(Patient patient3) {
        return iPatientRegistrationRepository.getPatientProfileDetails(patient3.getUserName());
    }

    public LoginMessage changePassword(PatientChangePasswordDTO patientChangePasswordDTO) {
        PatientL patientL1=iPatientLoginRepository.findByEmailAndPassword(patientChangePasswordDTO.getUserName(),patientChangePasswordDTO.getCurrentPassword());
        Patient patient=iPatientRegistrationRepository.getPatientProfileDetails(patientChangePasswordDTO.getUserName());
        if (patientL1 == null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (patientChangePasswordDTO.getCurrentPassword().equals(patientChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        iPatientLoginRepository.changePassword(patientChangePasswordDTO.getUserName(),patientChangePasswordDTO.getNewPassword());
        patientChangePasswordDTO.setEmail(patient.getEmail());
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }
}
