package com.example.had_backend.Patient.Service;


import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.UserName;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUserNameRepository;
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

import java.util.List;

@Service
public class PatientService {
    @Autowired
    private IPatientLoginRepository iPatientLoginRepository;
    @Autowired
    private IPatientRegistrationRepository iPatientRegistrationRepository;
    @Autowired
    private IUserNameRepository iUserNameRepository;
    @Autowired
    private ICasesRepository iCasesRepository;


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
        UserName userName = new UserName();

        UserName userName1 = iUserNameRepository.getProfile(register.getUserName());
        if (userName1!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }
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

        patientL.setUserName(register.getUserName());
        patientL.setPassword(register.getPassword());
        patientL.setPatient(patient);



        iPatientLoginRepository.save(patientL);

        patient.setPatientL(patientL);
        iPatientRegistrationRepository.save(patient);

        userName.setUserName(register.getUserName());
        iUserNameRepository.save(userName);

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

    public LoginMessage removePatient(RegisterDTO registerDTO) {
        Patient patient = iPatientRegistrationRepository
                .getPatientProfile(registerDTO.getUserName(), registerDTO.getEmail());


        iPatientLoginRepository.updateAndSetPatientIdNull(patient.getPatientId());
        iPatientRegistrationRepository.removeEntry(patient.getPatientId());
        LoginMessage removeDoc = new LoginMessage();
        removeDoc.setMessage("Patient Profile Deleted Successfully");
        return removeDoc;
    }

    public List<Cases> getCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getCases(searchResultDTO.getSearchResult());
    }

    public List<Cases> getAllCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getAllCasesPatient(searchResultDTO.getUserName());
    }
}
