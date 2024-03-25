package com.example.had_backend.Doctor.Controller;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Service.DoctorService;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @Autowired
    private EmailService emailService;

    @CrossOrigin
    @PostMapping("/doctor/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        DoctorL doctorL = doctorService.authenticate(login);
        LoginMessage message = new LoginMessage();
        //change
        if(doctorL.getDoctor().getDoctorId() != null){
            message.setMessage("Login Successful");
            message.setToken(userAuthProvider.createToken(doctorL.getUserName()));
        }else{
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }
    @CrossOrigin
    @PostMapping("/doctor/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated DoctorRegistrationDTO doctorRegistrationDTO) {
        LoginMessage loginMessage = doctorService.register(doctorRegistrationDTO);
        if(!loginMessage.getMessage().equals("User is already registered")){
            emailService.sendSimpleMessage(
                    doctorRegistrationDTO.getEmail(),
                    "Registration in Kavach portal was successful",
                    "Username: "+doctorRegistrationDTO.getUserName()+ "\n"+"Password: "+doctorRegistrationDTO.getPassword());
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/doctor/getProfileDetails")
    public ResponseEntity<Doctor> getProfileDetails(@RequestBody @Validated Doctor doctor3) {
        Doctor doctor4 = doctorService.profile(doctor3);
        return ResponseEntity.ok(doctor4);
    }

    @CrossOrigin
    @PostMapping("/doctor/changePassword")
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated DoctorChangePasswordDTO doctorChangePasswordDTO ) {
        LoginMessage loginMessage1 = doctorService.changePassword(doctorChangePasswordDTO);
        if(loginMessage1.getMessage().equals("Password updated successfully")){
            emailService.sendSimpleMessage(
                    doctorChangePasswordDTO.getEmail(),
                    "Password has been changed successfully",
                    "Username: "+doctorChangePasswordDTO.getUserName()+ "\n"+"Password: "+doctorChangePasswordDTO.getNewPassword());
        }
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/doctor/remove")
    public ResponseEntity<LoginMessage> removeDoctor(@RequestBody @Validated DoctorRegistrationDTO doctorRegistrationDTO ) {
        LoginMessage loginMessage1 = doctorService.removeDoctor(doctorRegistrationDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/doctor/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO ) {
        List<Cases> list = doctorService.getCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/doctor/getListOfCases")
    public ResponseEntity<List<Cases>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = doctorService.getAllCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }
}
