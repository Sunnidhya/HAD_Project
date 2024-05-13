package com.example.had_backend.Lab.Controller;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.*;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Model.LabChangePasswordDTO;
import com.example.had_backend.Lab.Model.LabRegistrationDTO;
import com.example.had_backend.Lab.Model.LabSendOTPDTO;
import com.example.had_backend.Lab.Service.LabService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Radiologist.Entity.Radiologist;
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
        Users users = labService.authenticateUser(login);
        Lab lab = labService.getProfile(login);
        OTP otp = labService.getOtp(lab);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (users != null) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        lab.getEmail(),
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
    @PostMapping("/lab/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = labService.validateOTP(otpDTO);
        if (loginMessage.getMessage().equals("OTP Validated successfully, Login was Successful")) {
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/lab/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated LabRegistrationDTO register) {
        LoginMessage loginMessage = labService.registerLab(register);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (!loginMessage.getMessage().equals("User is already registered")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        register.getEmail(),
                        "Registration in Kavach portal was successful",
                        "Username: " + register.getUserName() + "\n" + "Password: " + register.getPassword());
            });
        }
        executorService.shutdown();
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
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage1.getMessage().equals("Password updated successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        labChangePasswordDTO.getEmail(),
                        "Password has been changed successfully",
                        "Username: " + labChangePasswordDTO.getUserName() + "\n" + "Password: " + labChangePasswordDTO.getNewPassword());
            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/lab/remove")
    public ResponseEntity<LoginMessage> removeLab(@RequestBody @Validated LabRegistrationDTO labRegistrationDTO) {
        LoginMessage loginMessage1 = labService.removeLab(labRegistrationDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/lab/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = labService.getCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/lab/getListOfCases")
    public ResponseEntity<List<CasesReturnDTO>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = labService.getAllCases(searchResultDTO);
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
    @GetMapping("/lab/getListOfLabs")
    public ResponseEntity<List<Lab>> getListOfLabs() {
        List<Lab> list = labService.getAllLabs();
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/lab/uploadImages")
    public ResponseEntity<LoginMessage> uploadPrescriptionScannedImage(@RequestBody @Validated UploadImagesDTO uploadImagesDTO) {
        LoginMessage loginMessage = labService.uploadImages(uploadImagesDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(4);
        if (loginMessage.getMessage().equals("Images uploaded successfully")) {
            Cases cases = labService.getCaseByCaseId(uploadImagesDTO.getCaseId());
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        cases.getDoctor().getEmail(),
                        "Lab has uploaded the image",
                        "CaseId: " + cases.getCaseId() + "\n" + "CaseName: " + cases.getCaseName() + "\n" + "Doctor assigned: " + cases.getDoctor().getName() + "\n" +
                                "Case Description: " + cases.getCaseDescription());
            });
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        cases.getPatient().getEmail(),
                        "Lab has uploaded the image",
                        "CaseId: " + cases.getCaseId() + "\n" + "CaseName: " + cases.getCaseName() + "\n" + "Doctor assigned: " + cases.getDoctor().getName() + "\n" +
                                "Case Description: " + cases.getCaseDescription());
            });

            for (Radiologist r : cases.getRadiologist()) {
                executorService.submit(() -> {
                    emailService.sendSimpleMessage(
                            r.getEmail(),
                            "Lab has uploaded the image",
                            "CaseId: " + cases.getCaseId() + "\n" + "CaseName: " + cases.getCaseName() + "\n" + "Doctor assigned: " + cases.getDoctor().getName() + "\n" +
                                    "Case Description: " + cases.getCaseDescription());
                });
            }
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/lab/sendOTP")
    public ResponseEntity<LoginMessage> sendOTP(@RequestBody @Validated CasesDTO casesDTO) {
        LabSendOTPDTO otp = labService.sendOTP(casesDTO);
        LoginMessage message = new LoginMessage();
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (otp != null) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        otp.getEmail(),
                        "Please use the following OTP to Authenticate yourself to the Lab",
                        "OTP: " + otp.getOtp().getOneTimePasswordCode());
            });
            message.setMessage("OTP sent to registered email address");
        } else {
            message.setMessage("Login failed, Check username/password");
        }
        executorService.shutdown();
        return ResponseEntity.ok(message);
    }
}



