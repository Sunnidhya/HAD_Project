package com.example.had_backend.Radiologist.Controller;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.*;
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
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

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
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (users != null) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        radiologist.getEmail(),
                        "Please use the following OTP to Authenticate Login",
                        "OTP: " + otp.getOneTimePasswordCode());
            });
            message.setMessage("OTP sent to registered email address");
        } else {
            message.setMessage("Login failed, Check username/password");
        }
        executorService.shutdown();
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/radiologist/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = radiologistService.validateOTP(otpDTO);
        if (loginMessage.getMessage().equals("OTP Validated successfully, Login was Successful")) {
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/radiologist/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated RadiologistRegistrationDTO radiologistRegistrationDTO) {
        LoginMessage loginMessage = radiologistService.register(radiologistRegistrationDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (!loginMessage.getMessage().equals("User is already registered")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        radiologistRegistrationDTO.getEmail(),
                        "Registration in Kavach portal was successful",
                        "Username: " + radiologistRegistrationDTO.getUserName() + "\n" + "Password: " + radiologistRegistrationDTO.getPassword());
            });
        }
        executorService.shutdown();
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
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated RadiologistChangePasswordDTO radiologistChangePasswordDTO) {
        LoginMessage loginMessage1 = radiologistService.changePassword(radiologistChangePasswordDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage1.getMessage().equals("Password updated successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        radiologistChangePasswordDTO.getEmail(),
                        "Password has been changed successfully",
                        "Username: " + radiologistChangePasswordDTO.getUserName() + "\n" + "Password: " + radiologistChangePasswordDTO.getNewPassword());
            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/radiologist/remove")
    public ResponseEntity<LoginMessage> removeRadiologist(@RequestBody @Validated RadiologistRegistrationDTO radiologistRegistrationDTO) {
        LoginMessage loginMessage1 = radiologistService.removePatient(radiologistRegistrationDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/radiologist/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO) {
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
            casesReturnDTO.setCaseDescription(cases.getCaseDescription());
//            if(cases.getRadiologist() != null) {
//                casesReturnDTO.setRadioName(cases.getRadiologist().getName());
//            }else{
//                casesReturnDTO.setRadioName("Not yet assigned");
//            }
            Set<Radiologist> radiologists = cases.getRadiologist();
            if (radiologists != null && !radiologists.isEmpty()) {
                StringBuilder radiologistNames = new StringBuilder();
                for (Radiologist radiologist : radiologists) {
                    radiologistNames.append(radiologist.getName()).append(", ");
                }
                radiologistNames.delete(radiologistNames.length() - 2, radiologistNames.length()); // Remove the last comma and space
                casesReturnDTO.setRadioName(radiologistNames.toString());
            } else {
                casesReturnDTO.setRadioName("Not yet assigned");
            }
            if (cases.getLab() != null) {
                casesReturnDTO.setLabName(cases.getLab().getLabName());
            } else {
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
    @PostMapping("/radiologist/getCaseByCaseId")
    public ResponseEntity<CasesDetailsDTO> getCaseByCaseId(@RequestBody @Validated CasesDTO casesDTO) {
        CasesDetailsDTO casesDetailsDTO = radiologistService.getCaseByCaseId(casesDTO);
        return ResponseEntity.ok(casesDetailsDTO);
    }

    @CrossOrigin
    @PostMapping("/radiologist/updateRadioImpression")
    public ResponseEntity<LoginMessage> radioImpressionUpdate(@RequestBody @Validated RadioImpressionDTO radioImpressionDTO) {
        LoginMessage loginMessage = radiologistService.updateRadioImpression(radioImpressionDTO);
        return ResponseEntity.ok(loginMessage);
    }
}
