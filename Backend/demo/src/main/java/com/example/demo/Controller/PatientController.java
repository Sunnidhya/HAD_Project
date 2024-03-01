package com.example.demo.Controller;

import com.example.demo.Model.LoginDTO;
import com.example.demo.Model.LoginMessage;
import com.example.demo.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PatientController {

    @Autowired
    private PatientService patientService;

    @CrossOrigin
    @PostMapping("/login")
    public String login(@RequestBody LoginDTO login) {
        LoginMessage message = patientService.authenticate(login);
        return message.getMessage();
    }
}
