package com.example.had_backend.Lab.Controller;

import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Entity.Labl;
import com.example.had_backend.Lab.Model.LabChangePasswordDTO;
import com.example.had_backend.Lab.Model.LabRegistrationDTO;
import com.example.had_backend.Lab.Service.LabService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LabController {

    @Autowired
    private LabService labService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @Autowired
    private EmailService emailService;

    @CrossOrigin
    @PostMapping("/lab/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        Labl labl = labService.authenticate(login);
        LoginMessage message = new LoginMessage();
        if (labl.getLabId() != null) {
            message.setMessage("Login Successful");
            message.setToken(userAuthProvider.createToken(labl.getUserName()));
        } else {
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/lab/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated LabRegistrationDTO register) {
        LoginMessage loginMessage = labService.registerLab(register);
        if (!loginMessage.getMessage().equals("User is already registered")) {
            emailService.sendSimpleMessage(
                    register.getEmail(),
                    "Registration in Kavach portal was successful",
                    "Username: " + register.getUserName() + "\n" + "Password: " + register.getPassword());
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/lab/getProfileDetails")
    public ResponseEntity<Lab> getProfileDetails(@RequestBody @Validated Lab lab2) {
        Lab lab = labService.getProfile(lab2);
        return ResponseEntity.ok(lab);
    }

    @CrossOrigin
    @PostMapping("/lab/changePassword")
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated LabChangePasswordDTO labChangePasswordDTO) {
        LoginMessage loginMessage1 = labService.changePassword(labChangePasswordDTO);
        if (loginMessage1.getMessage().equals("Password updated successfully")) {
            emailService.sendSimpleMessage(
                    labChangePasswordDTO.getEmail(),
                    "Password has been changed successfully",
                    "Username: " + labChangePasswordDTO.getUserName() + "\n" + "Password: " + labChangePasswordDTO.getNewPassword());
        }
        return ResponseEntity.ok(loginMessage1);
    }
}



