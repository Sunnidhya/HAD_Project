package com.example.had_backend.Patient.Controller;

import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.CasesReturnDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Entity.Labl;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Patient.Model.PatientChangePasswordDTO;
import com.example.had_backend.Patient.Model.RegisterDTO;
import com.example.had_backend.Patient.Service.PatientService;
import com.example.had_backend.WebSecConfig.UserAuthProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
        PatientL patientL = patientService.authenticate(login);
        Patient patient = patientService.getProfile(login);
        OTP otp = patientService.getOtp();
        if(patientL.getPatient().getPatientId() != null){
            emailService.sendSimpleMessage(
                    patient.getEmail(),
                    "Please use the following OTP to Authenticate Login",
                    "OTP: " + otp.getOneTimePasswordCode());
            message.setMessage("OTP sent to registered email address");
        }else {
            message.setMessage("Login failed, Check username/password");
        }
        return ResponseEntity.ok(message);
    }

    @CrossOrigin
    @PostMapping("/patient/login/validateOTP")
    public ResponseEntity<LoginMessage> loginValidateOTP(@RequestBody @Validated OtpDTO otpDTO) {
        LoginMessage loginMessage = patientService.validateOTP(otpDTO);
        if(loginMessage.getMessage().equals("OTP Validated successfully, Login was Successful")){
            loginMessage.setToken(userAuthProvider.createToken(otpDTO.getUserName()));
        }
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/patient/register")
    public ResponseEntity<LoginMessage> register(@RequestBody @Validated RegisterDTO register) {
        LoginMessage loginMessage = patientService.registerPatient(register);
        if(!loginMessage.getMessage().equals("User is already registered")){
            emailService.sendSimpleMessage(
                    register.getEmail(),
                    "Registration in Kavach portal was successful",
                    "Username: "+register.getUserName()+ "\n"+"Password: "+register.getPassword());
        }
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
    public ResponseEntity<LoginMessage> changePassword(@RequestBody @Validated PatientChangePasswordDTO patientChangePasswordDTO ) {
        LoginMessage loginMessage1 = patientService.changePassword(patientChangePasswordDTO);
        if(loginMessage1.getMessage().equals("Password updated successfully")){
            emailService.sendSimpleMessage(
                    patientChangePasswordDTO.getEmail(),
                    "Password has been changed successfully",
                    "Username: "+patientChangePasswordDTO.getUserName()+ "\n"+"Password: "+patientChangePasswordDTO.getNewPassword());
        }
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/patient/remove")
    public ResponseEntity<LoginMessage> removePatient(@RequestBody @Validated RegisterDTO registerDTO ) {
        LoginMessage loginMessage1 = patientService.removePatient(registerDTO);
        return ResponseEntity.ok(loginMessage1);
    }

    @CrossOrigin
    @PostMapping("/patient/getSearchResult")
    public ResponseEntity<List<Cases>> getSearchResult(@RequestBody @Validated SearchResultDTO searchResultDTO ) {
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
            casesReturnDTO.setRadioName(cases.getRadiologist().getName());
            casesReturnDTO.setLabName(cases.getLab().getLabName());
            casesReturnDTO.setPatientName(cases.getPatient().getFullName());
            casesReturnDTOS.add(casesReturnDTO);
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
    public ResponseEntity<LoginMessage> assignRadiologist(@RequestBody @Validated CasesDTO casesDTO){
        LoginMessage loginMessage = patientService.updateCaseR(casesDTO);
        return ResponseEntity.ok(loginMessage);
    }

    @CrossOrigin
    @PostMapping("/patient/assignLab")
    public ResponseEntity<LoginMessage> assignLab(@RequestBody @Validated CasesDTO casesDTO){
        LoginMessage loginMessage = patientService.updateCaseL(casesDTO);
        return ResponseEntity.ok(loginMessage);
    }
}
