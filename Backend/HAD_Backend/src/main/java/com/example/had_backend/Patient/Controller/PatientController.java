package com.example.had_backend.Patient.Controller;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.*;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Model.PatientChangePasswordDTO;
import com.example.had_backend.Patient.Model.RegisterDTO;
import com.example.had_backend.Patient.Service.PatientService;
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
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private UserAuthProvider userAuthProvider;

    @Autowired
    private EmailService emailService;

    @CrossOrigin
    @PostMapping("/patient/login")
    public ResponseEntity<LoginMessage> login(@RequestBody @Validated LoginDTO login) {
        LoginMessage message = new LoginMessage();
        Users users = patientService.authenticateUser(login);
        Patient patient = patientService.getProfile(login);
        OTP otp = patientService.getOtpUser(patient);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (users != null) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        patient.getEmail(),
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
    @PostMapping("/patient/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = patientService.validateOTP(otpDTO);
        if (loginMessage.getMessage().equals("OTP Validated successfully, Login was Successful")) {
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/patient/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated RegisterDTO register) {
        LoginMessage loginMessage = patientService.registerPatient(register);
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
    @PostMapping("/patient/getProfileDetails")
    public ResponseEntity<Patient> getProfileDetails(@RequestBody @Validated LoginDTO loginDTO) {
        Patient patient4 = patientService.getProfile(loginDTO);
        return ResponseEntity.ok(patient4);
    }

    @CrossOrigin
    @PostMapping("/patient/changePassword")
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated PatientChangePasswordDTO patientChangePasswordDTO) {
        LoginMessage loginMessage1 = patientService.changePassword(patientChangePasswordDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage1.getMessage().equals("Password updated successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        patientChangePasswordDTO.getEmail(),
                        "Password has been changed successfully",
                        "Username: " + patientChangePasswordDTO.getUserName() + "\n" + "Password: " + patientChangePasswordDTO.getNewPassword());
            });
        }
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/patient/remove")
    public ResponseEntity<LoginMessage> removePatient(@RequestBody @Validated RegisterDTO registerDTO) {
        LoginMessage loginMessage1 = patientService.removePatient(registerDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/patient/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = patientService.getCases(searchResultDTO);
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/patient/getListOfCases")
    public ResponseEntity<List<CasesReturnDTO>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = patientService.getAllCases(searchResultDTO);
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
            List<RadioDTO> radioDTOS = new ArrayList<>();
            if (cases.getConsent() != null && cases.getConsent().getRadioDTOS() != null) {
                for (RadioDTO radioDTO : cases.getConsent().getRadioDTOS()) {
                    RadioDTO radioDTO1 = new RadioDTO();
                    radioDTO1.setRadioId(radioDTO.getRadioId());
                    radioDTO1.setRadioName(radioDTO.getRadioName());
                    radioDTO1.setRadioConsent(radioDTO.getRadioConsent());
                    radioDTOS.add(radioDTO1);
                }
            }
            casesReturnDTO.setRadioDTOList(radioDTOS);
        }
        return ResponseEntity.ok(casesReturnDTOS);
    }

    @CrossOrigin
    @GetMapping("/patient/getListOfPatients")
    public ResponseEntity<List<Patient>> getListOfPatients() {
        List<Patient> list = patientService.getAllPatients();
        return ResponseEntity.ok(list);
    }

    @CrossOrigin
    @PostMapping("/patient/assignRadiologist")
    public ResponseEntity<LoginMessage> assignRadiologist(@RequestBody @Validated CasesDTO casesDTO) {
        LoginMessage loginMessage = patientService.updateCaseR(casesDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage.getMessage().equals("Radiologist Assigned Successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        loginMessage.getEmail(),
                        "A new case has been assigned",
                        "CaseName: " + casesDTO.getCaseName() + "\n" + "Doctor assigned: " + casesDTO.getDoctorName() + "\n" +
                                "Case Description: " + casesDTO.getCaseDescription());
            });
        }
        loginMessage.setEmail("");
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/patient/assignLab")
    public ResponseEntity<LoginMessage> assignLab(@RequestBody @Validated CasesDTO casesDTO) {
        LoginMessage loginMessage = patientService.updateCaseL(casesDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage.getMessage().equals("Lab Assigned Successfully")) {
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        loginMessage.getEmail(),
                        "A new case has been assigned",
                        "CaseName: " + casesDTO.getCaseName() + "\n" + "Doctor assigned: " + casesDTO.getDoctorName() + "\n" +
                                "Case Description: " + casesDTO.getCaseDescription());
            });
        }
        loginMessage.setEmail("");
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @GetMapping("/patient/getCaseByCaseId")
    public ResponseEntity<CasesDetailsDTO> getCaseByCaseId(@RequestBody @Validated CasesDTO casesDTO) {
        CasesDetailsDTO casesDetailsDTO = patientService.getCaseByCaseId(casesDTO);
        return ResponseEntity.ok(casesDetailsDTO);
    }

    @CrossOrigin
    @PostMapping("/patient/assignRemoveNewRadiologist")
    public ResponseEntity<LoginMessage> assignRemoveNewRadiologist(@RequestBody @Validated CasesNewRadioDTO casesNewRadioDTO) {
        LoginMessage loginMessage = patientService.assignNewRadio(casesNewRadioDTO);
        ExecutorService executorService = Executors.newFixedThreadPool(1);
        if (loginMessage.getMessage().equals("Lab Assigned Successfully")) {
            Cases cases = patientService.getCaseByCaseId(casesNewRadioDTO.getCaseId());
            executorService.submit(() -> {
                emailService.sendSimpleMessage(
                        loginMessage.getEmail(),
                        "A new case has been assigned",
                        "CaseName: " + cases.getCaseName() + "\n" + "Doctor assigned: " + cases.getDoctor().getName() + "\n" +
                                "Case Description: " + cases.getCaseDescription());
            });
        }
        loginMessage.setEmail("");
        executorService.shutdown();
        return ResponseEntity.ok(loginMessage);
    }
}
