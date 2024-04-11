package com.example.had_backend.Radiologist.Controller;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.CasesDetailsDTO;
import com.example.had_backend.Global.Model.CasesReturnDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Model.RadiologistChangePasswordDTO;
import com.example.had_backend.Radiologist.Model.RadiologistRegistrationDTO;
import com.example.had_backend.Radiologist.Service.RadiologistService;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class RadiologistController {

    @Autowired
    private RadiologistService radiologistService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @Autowired
    private EmailService emailService;

    @CrossOrigin
    @PostMapping("/radiologist/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        LoginMessage message = new LoginMessage();
        Users users = radiologistService.authenticateUser(login);
        Radiologist radiologist = radiologistService.profile(login);
        OTP otp = radiologistService.getOtpUser(radiologist);
        if(users != null){
            emailService.sendSimpleMessage(
                    radiologist.getEmail(),
                    "Please use the following OTP to Authenticate Login",
                    "OTP: " + otp.getOneTimePasswordCode());
            message.setMessage("OTP sent to registered email address");
        }else {
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/radiologist/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = radiologistService.validateOTP(otpDTO);
        if(loginMessage.getMessage().equals("OTP Validated successfully, Login was Successful")){
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/radiologist/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated RadiologistRegistrationDTO radiologistRegistrationDTO) {
        LoginMessage loginMessage = radiologistService.register(radiologistRegistrationDTO);
        if(!loginMessage.getMessage().equals("User is already registered")){
            emailService.sendSimpleMessage(
                    radiologistRegistrationDTO.getEmail(),
                    "Registration in Kavach portal was successful",
                    "Username: "+radiologistRegistrationDTO.getUserName()+ "\n"+"Password: "+radiologistRegistrationDTO.getPassword());
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/radiologist/getProfileDetails")
    public ResponseEntity<Radiologist> getProfileDetails(@RequestBody @Validated LoginDTO loginDTO) {
        Radiologist radiologist1 = radiologistService.profile(loginDTO);
        return ResponseEntity.ok(radiologist1);
    }

    @CrossOrigin
    @PostMapping("/radiologist/changePassword")
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated RadiologistChangePasswordDTO radiologistChangePasswordDTO ) {
        LoginMessage loginMessage1 = radiologistService.changePassword(radiologistChangePasswordDTO);
        if(loginMessage1.getMessage().equals("Password updated successfully")){
            emailService.sendSimpleMessage(
                    radiologistChangePasswordDTO.getEmail(),
                    "Password has been changed successfully",
                    "Username: "+radiologistChangePasswordDTO.getUserName()+ "\n"+"Password: "+radiologistChangePasswordDTO.getNewPassword());
        }
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/radiologist/remove")
    public ResponseEntity<LoginMessage> removeRadiologist(@RequestBody @Validated RadiologistRegistrationDTO radiologistRegistrationDTO ) {
        LoginMessage loginMessage1 = radiologistService.removePatient(radiologistRegistrationDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/radiologist/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO ) {
        List<Cases> list = radiologistService.getCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/radiologist/getListOfCases")
    public ResponseEntity<List<CasesReturnDTO>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = radiologistService.getAllCases(searchResultDTO);
        List<CasesReturnDTO> casesReturnDTOS = new ArrayList<>();

        for (Cases cases : list) {
            CasesReturnDTO casesReturnDTO = new CasesReturnDTO();
            casesReturnDTO.setCaseId(cases.getCaseId());
            casesReturnDTO.setCaseName(cases.getCaseName());
            casesReturnDTO.setCaseDate(cases.getCaseDate());
            casesReturnDTO.setDoctorName(cases.getDoctor().getName());
            if(cases.getRadiologist() != null) {
                casesReturnDTO.setRadioName(cases.getRadiologist().getName());
            }else{
                casesReturnDTO.setRadioName("Not yet assigned");
            }
            if(cases.getLab() != null) {
                casesReturnDTO.setLabName(cases.getLab().getLabName());
            }else{
                casesReturnDTO.setLabName("Not yet assigned");
            }
            casesReturnDTO.setPatientName(cases.getPatient().getFullName());
            casesReturnDTO.setMarkAsDone(cases.getMarkAsDone());
            casesReturnDTOS.add(casesReturnDTO);
        }
        return ResponseEntity.ok(casesReturnDTOS);
    }

    @CrossOrigin
    @GetMapping("/radilogist/getListOfRadiologists")
    public ResponseEntity<List<Radiologist>> getListOfRadiologists() {
        List<Radiologist> list = radiologistService.getAllRadiologists();
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @GetMapping("/radiologist/getCaseByCaseId")
    public ResponseEntity<CasesDetailsDTO> getCaseByCaseId(@RequestBody @Validated CasesDTO casesDTO) {
        CasesDetailsDTO casesDetailsDTO = radiologistService.getCaseByCaseId(casesDTO);
        return ResponseEntity.ok(casesDetailsDTO);
    }
}
