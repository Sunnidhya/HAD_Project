package com.example.had_backend.Lab.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Entity.Labl;
import com.example.had_backend.Lab.Model.LabChangePasswordDTO;
import com.example.had_backend.Lab.Model.LabRegistrationDTO;
import com.example.had_backend.Lab.Repository.ILabLoginRepository;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LabService {

    @Autowired
    private ILabLoginRepository iLabLoginRepository;

    @Autowired
    private ILabRegistrationRepository iLabRegistrationRepository;
    public Labl authenticate(LoginDTO loginDTO) {
        Labl labl = new Labl();
        try {
            labl = iLabLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return labl;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return labl;
    }

    public LoginMessage registerLab(LabRegistrationDTO labRegistrationDTO) {
        Lab lab = new Lab();
        Labl labl = new Labl();

        Lab lab2=iLabRegistrationRepository.getLab(labRegistrationDTO.getUserName(),labRegistrationDTO.getEmail());
        if (lab2 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        lab.setLabName(labRegistrationDTO.getLabName());
        lab.setContactNo(labRegistrationDTO.getContactNo());
        lab.setEmail(labRegistrationDTO.getEmail());
        lab.setUserName(labRegistrationDTO.getUserName());
        iLabRegistrationRepository.save(lab);


        Lab lab1=iLabRegistrationRepository.getLab(labRegistrationDTO.getUserName(),labRegistrationDTO.getEmail());
        labl.setLabId(lab1.getLabId());
        labl.setUserName(labRegistrationDTO.getUserName());
        labl.setPassword(labRegistrationDTO.getPassword());
        iLabLoginRepository.save(labl);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Lab getProfile(Lab lab3) {
        return iLabRegistrationRepository.getProfile(lab3.getUserName());
    }

    public LoginMessage changePassword(LabChangePasswordDTO labChangePasswordDTO) {
        Labl labl1=iLabLoginRepository.findByEmailAndPassword(labChangePasswordDTO.getUserName(),labChangePasswordDTO.getCurrentPassword());

        if (labl1 == null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (labChangePasswordDTO.getCurrentPassword().equals(labChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        iLabLoginRepository.changePassword(labChangePasswordDTO.getUserName(),labChangePasswordDTO.getNewPassword());
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }
}
