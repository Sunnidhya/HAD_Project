package com.example.demo.Service;

import com.example.demo.Entity.PatientL;
import com.example.demo.Model.LoginDTO;
import com.example.demo.Model.LoginMessage;
import com.example.demo.Repository.IPatientLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    @Autowired
    private IPatientLoginRepository iPatientLoginRepository;

    public LoginMessage authenticate(LoginDTO loginDTO) {
        try {
            PatientL login = iPatientLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            LoginMessage loginMessage = new LoginMessage();
            if(login != null){
                loginMessage.setMessage("Login Successful");
            }else{
                loginMessage.setMessage("Login was not Successful, Wrong Username/ Password");
            }
            return loginMessage;
        } catch (Exception e) {
            e.printStackTrace();
        }
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Login was not Successful, Wrong Username/ Password");
        return loginMessage;
    }
}
