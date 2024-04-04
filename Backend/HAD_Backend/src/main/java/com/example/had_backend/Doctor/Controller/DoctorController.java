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
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.CasesReturnDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Service.PatientService;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
        if(users != null){
            emailService.sendSimpleMessage(
                    doctor.getEmail(),
                    "Please use the following OTP to Authenticate Login",
                    "OTP: " + otp.getOneTimePasswordCode());
            message.setMessage("OTP sent to registered email address");
        }else {
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/doctor/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = doctorService.validateOTP(otpDTO);
        if(loginMessage.getMessage().equals("OTP Validated successfully")){
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
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
    public ResponseEntity<Doctor> getProfileDetails(@RequestBody @Validated LoginDTO loginDTO) {
        Doctor doctor4 = doctorService.profile(loginDTO);
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
    public ResponseEntity<List<CasesReturnDTO>> getListOfCases(@RequestBody @Validated SearchResultDTO searchResultDTO) {
        List<Cases> list = doctorService.getAllCases(searchResultDTO);
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
        Doctor doctor = doctorService.getDoctorByUserName(casesDTO.getDoctorName());
        Patient patient = patientService.getPatientByUserName(casesDTO.getPatientName());
        cases.setDoctor(doctor);
        cases.setPatient(patient);
        LoginMessage loginMessage = doctorService.createCase(cases);
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @GetMapping("/doctor/markAsDone")
    public ResponseEntity<LoginMessage> markAsDone(@RequestBody @Validated CasesDTO casesDTO) {
        LoginMessage loginMessage= doctorService.markAsDone(casesDTO);
        return ResponseEntity.ok(loginMessage);
    }
}