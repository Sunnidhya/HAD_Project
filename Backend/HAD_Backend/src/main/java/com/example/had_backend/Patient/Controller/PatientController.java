package com.example.had_backend.Patient.Controller;

import com.example.had_backend.WebSecConfig.UserAuthProvider;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @CrossOrigin
    @PostMapping("/patient/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        PatientL patientL = patientService.authenticate(login);
        LoginMessage message = new LoginMessage();
        if(patientL.getPatientId() != null){
            message.setMessage("Login Successful");
            message.setToken(userAuthProvider.createToken(patientL.getUserName()));
        }else{
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/patient/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated LoginDTO login) {
//        LoginMessage message = patientService.authenticate(login);
        LoginMessage message = new LoginMessage();
        message.setMessage("Register Successful");
        return ResponseEntity.ok(message);
    }
}
