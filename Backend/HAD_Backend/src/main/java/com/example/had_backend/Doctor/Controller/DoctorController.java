package com.example.had_backend.Doctor.Controller;

import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Service.DoctorService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @CrossOrigin
    @PostMapping("/doctor/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        DoctorL doctorL = doctorService.authenticate(login);
        LoginMessage message = new LoginMessage();
        if(doctorL.getDoctorId() != null){
            message.setMessage("Login Successful");
            message.setToken(userAuthProvider.createToken(doctorL.getUserName()));
        }else{
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }
}
