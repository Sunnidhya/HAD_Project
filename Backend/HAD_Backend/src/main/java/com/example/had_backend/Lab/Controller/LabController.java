package com.example.had_backend.Lab.Controller;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Model.OtpDTO;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        LoginMessage message = new LoginMessage();
        Labl labl = labService.authenticate(login);
        Lab lab = labService.getProfile(login);
        OtpDTO otpDTO = labService.getOtp();
        if(labl.getLab().getLabId() != null){
            if(otpDTO.getOtp() != null) {
                emailService.sendSimpleMessage(
                        lab.getEmail(),
                        "Please use the following OTP to Authenticate Login",
                        "OTP: " + otpDTO.getOtp());
                message.setMessage("OTP sent to registered email address");
            }
        }else {
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/lab/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = labService.validateOTP(otpDTO);
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUserName(otpDTO.getUserName());
        Lab lab = labService.getProfile(loginDTO);
        if(loginMessage.getMessage().equals("OTP Validated successfully, Login was Successful")){
            loginMessage.setToken(userAuthProvider.createToken(lab.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
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
    public ResponseEntity<Lab> getProfileDetails(@RequestBody @Validated LoginDTO loginDTO) {
        Lab lab = labService.getProfile(loginDTO);
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

    @CrossOrigin
    @PostMapping("/lab/remove")
    public ResponseEntity<LoginMessage> removeLab(@RequestBody @Validated LabRegistrationDTO labRegistrationDTO ) {
        LoginMessage loginMessage1 = labService.removeLab(labRegistrationDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/lab/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO ) {
        List<Cases> list = labService.getCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/lab/getListOfCases")
    public ResponseEntity<List<Cases>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = labService.getAllCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @GetMapping("/lab/getListOfLabs")
    public ResponseEntity<List<Lab>> getListOfLabs() {
        List<Lab> list = labService.getAllLabs();
        return ResponseEntity.ok(list);
    }
}



