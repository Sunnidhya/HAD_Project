package com.example.had_backend.Doctor.Controller;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Service.DoctorService;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.*;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Service.PatientService;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @Autowired
    private EmailService emailService;

    @CrossOrigin
    @PostMapping("/doctor/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        LoginMessage message = new LoginMessage();
        Users users = doctorService.authenticateUser(login);
        Doctor doctor = doctorService.profile(login);
        OTP otp = doctorService.getOtpUser(doctor);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (users != null) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        doctor.getEmail(),
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
    @PostMapping("/doctor/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = doctorService.validateOTP(otpDTO);
        if (loginMessage.getMessage().equals("OTP Validated successfully")) {
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/doctor/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated DoctorRegistrationDTO doctorRegistrationDTO) {
        LoginMessage loginMessage = doctorService.register(doctorRegistrationDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (!loginMessage.getMessage().equals("User is already registered")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        doctorRegistrationDTO.getEmail(),
                        "Registration in Kavach portal was successful",
                        "Username: " + doctorRegistrationDTO.getUserName() + "\n" + "Password: " + doctorRegistrationDTO.getPassword());
            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/doctor/getProfileDetails")
    public ResponseEntity<Doctor> getProfileDetails(@RequestBody @Validated LoginDTO loginDTO) {
        Doctor doctor4 = doctorService.profile(loginDTO);
        return ResponseEntity.ok(doctor4);
    }

    @CrossOrigin
    @PostMapping("/doctor/changePassword")
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated DoctorChangePasswordDTO doctorChangePasswordDTO) {
        LoginMessage loginMessage1 = doctorService.changePassword(doctorChangePasswordDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage1.getMessage().equals("Password updated successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        doctorChangePasswordDTO.getEmail(),
                        "Password has been changed successfully",
                        "Username: " + doctorChangePasswordDTO.getUserName() + "\n" + "Password: " + doctorChangePasswordDTO.getNewPassword());

            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/doctor/remove")
    public ResponseEntity<LoginMessage> removeDoctor(@RequestBody @Validated DoctorRegistrationDTO doctorRegistrationDTO) {
        LoginMessage loginMessage1 = doctorService.removeDoctor(doctorRegistrationDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/doctor/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = doctorService.getCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/doctor/getListOfCases")
    public ResponseEntity<List<CasesReturnDTO>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = doctorService.getAllCases(searchResultDTO);
        List<CasesReturnDTO> casesReturnDTOS = new ArrayList<>();

        for (Cases cases : list) {
            CasesReturnDTO casesReturnDTO = new CasesReturnDTO();
            casesReturnDTO.setCaseId(cases.getCaseId());
            casesReturnDTO.setCaseName(cases.getCaseName());
            casesReturnDTO.setCaseDate(cases.getCaseDate());
            casesReturnDTO.setDoctorName(cases.getDoctor().getName());
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
            casesReturnDTO.setCaseDescription(cases.getCaseDescription());
            casesReturnDTOS.add(casesReturnDTO);
        }
        return ResponseEntity.ok(casesReturnDTOS);
    }

    @CrossOrigin
    @GetMapping("/doctor/getListOfDoctors")
    public ResponseEntity<List<Doctor>> getListOfDoctors() {
        List<Doctor> list = doctorService.getAllDoctors();
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/doctor/createCase")
    public ResponseEntity<LoginMessage> createCase(@RequestBody @Validated CasesDTO casesDTO) {
        Cases cases = new Cases();
        Date date = new Date();
        cases.setCaseName(casesDTO.getCaseName());
        cases.setCaseDate(date.getTime());
        cases.setCaseDescription(casesDTO.getCaseDescription());
        Doctor doctor = doctorService.getDoctorByUserName(casesDTO.getDoctorName());
        Patient patient = patientService.getPatientByUserName(casesDTO.getPatientName());
        cases.setDoctor(doctor);
        cases.setPatient(patient);
        LoginMessage loginMessage = doctorService.createCaseN(cases, doctor);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage.getMessage().equals("Case is created successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        patient.getEmail(),
                        "A new case has been created",
                        "CaseName: " + cases.getCaseName() + "\n" + "Doctor assigned: " + cases.getDoctor().getName() + "\n" +
                                "Case Description: " + cases.getCaseDescription());
            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/doctor/markAsDone")
    public ResponseEntity<LoginMessage> markAsDone(@RequestBody @Validated CasesDTO casesDTO) {
        LoginMessage loginMessage = doctorService.markAsDone(casesDTO);
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/doctor/getCaseByCaseId")
    public ResponseEntity<CasesDetailsDTO> getCaseByCaseId(@RequestBody @Validated CasesDTO casesDTO) {
        CasesDetailsDTO casesDetailsDTO = doctorService.getCaseByCaseId(casesDTO);
        return ResponseEntity.ok(casesDetailsDTO);
    }

    @CrossOrigin
    @PostMapping("/doctor/insertThreadChat")
    public ResponseEntity<CasesDetailsDTO> insertChatThread(@RequestBody @Validated CasesChatDTO casesChatDTO) {
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        CasesDetailsDTO casesDetailsDTO = doctorService.insertChatThread(casesChatDTO);
        if (casesDetailsDTO != null) {
            Radiologist radiologist = doctorService.getRadioById(casesChatDTO.getRadioId());
            Doctor doctor = doctorService.getDoctorByUserName(casesChatDTO.getUserName());
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        radiologist.getEmail(),
                        "Update has been made to the conversation",
                        "CaseId: " + casesDetailsDTO.getCaseId() + "\n\n" +
                                "CaseName: " + casesDetailsDTO.getCaseName() + "\n\n" +
                                "Doctor assigned: " + casesDetailsDTO.getDoctorName() + "\n\n" +
                                "Case Description: " + casesDetailsDTO.getCaseDescription());
            });
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        doctor.getEmail(),
                        "Update has been made to the conversation",
                        "CaseId: " + casesDetailsDTO.getCaseId() + "\n\n" +
                                "CaseName: " + casesDetailsDTO.getCaseName() + "\n\n" +
                                "Doctor assigned: " + radiologist.getName() + "\n\n" +
                                "Case Description: " + casesDetailsDTO.getCaseDescription());
            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(casesDetailsDTO);
    }

    @CrossOrigin
    @PostMapping("/doctor/updateReport")
    public ResponseEntity<CasesDetailsDTO> updateReport(@RequestBody @Validated CasesDetailsDTO casesDetailsDTO) {
        CasesDetailsDTO caseDetailsDTO1 = doctorService.updateReport(casesDetailsDTO);
        return ResponseEntity.ok(caseDetailsDTO1);
    }

    @CrossOrigin
    @PostMapping("/doctor/assignNewRadiologist")
    public ResponseEntity<LoginMessage> assignNewRadiologist(@RequestBody @Validated CasesDTO casesDTO) {
        LoginMessage loginMessage = doctorService.assignNewRadio(casesDTO);
        return ResponseEntity.ok(loginMessage);
    }
}