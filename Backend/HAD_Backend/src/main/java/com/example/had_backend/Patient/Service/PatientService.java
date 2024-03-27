package com.example.had_backend.Patient.Service;


import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.UserName;
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IOTPRepository;
import com.example.had_backend.Global.Repository.IUserNameRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Patient.Model.PatientChangePasswordDTO;
import com.example.had_backend.Patient.Model.RegisterDTO;
import com.example.had_backend.Patient.Repository.IPatientLoginRepository;
import com.example.had_backend.Patient.Repository.IPatientRegistrationRepository;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PatientService {
    @Autowired
    private IPatientLoginRepository iPatientLoginRepository;

    @Autowired
    private IPatientRegistrationRepository iPatientRegistrationRepository;

    @Autowired
    private IUserNameRepository iUserNameRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IOTPRepository iotpRepository;

    @Autowired
    private IRadiologistRegistrationRepository iRadiologistRegistrationRepository;

    @Autowired
    private ILabRegistrationRepository iLabRegistrationRepository;


    public PatientL authenticate(LoginDTO loginDTO) {
        PatientL patientL = new PatientL();
        try {
            patientL = iPatientLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return patientL;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return patientL;
    }

    public LoginMessage registerPatient(RegisterDTO register) {
        Patient patient = new Patient();
        PatientL patientL = new PatientL();
        UserName userName = new UserName();

        UserName userName1 = iUserNameRepository.getProfile(register.getUserName());
        if (userName1!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }
        Patient patient1=iPatientRegistrationRepository.getPatientProfile(register.getUserName(),register.getEmail());
        if (patient1 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        patient.setAddress(register.getAddress());
        patient.setContactNo(register.getContactNo());
        patient.setEmail(register.getEmail());
        patient.setFullName(register.getFullName());
        patient.setUserName(register.getUserName());

        patientL.setUserName(register.getUserName());
        patientL.setPassword(register.getPassword());
        patientL.setPatient(patient);



        iPatientLoginRepository.save(patientL);

        patient.setPatientL(patientL);
        iPatientRegistrationRepository.save(patient);

        userName.setUserName(register.getUserName());
        iUserNameRepository.save(userName);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Patient getProfile(LoginDTO loginDTO) {
        return iPatientRegistrationRepository.getPatientProfileDetails(loginDTO.getUserName());
    }

    public LoginMessage changePassword(PatientChangePasswordDTO patientChangePasswordDTO) {
        PatientL patientL1=iPatientLoginRepository.findByEmailAndPassword(patientChangePasswordDTO.getUserName(),patientChangePasswordDTO.getCurrentPassword());
        Patient patient=iPatientRegistrationRepository.getPatientProfileDetails(patientChangePasswordDTO.getUserName());
        if (patientL1 == null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (patientChangePasswordDTO.getCurrentPassword().equals(patientChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        iPatientLoginRepository.changePassword(patientChangePasswordDTO.getUserName(),patientChangePasswordDTO.getNewPassword());
        patientChangePasswordDTO.setEmail(patient.getEmail());
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removePatient(RegisterDTO registerDTO) {
        Patient patient = iPatientRegistrationRepository
                .getPatientProfile(registerDTO.getUserName(), registerDTO.getEmail());


        iPatientLoginRepository.updateAndSetPatientIdNull(patient.getPatientId());
        iPatientRegistrationRepository.removeEntry(patient.getPatientId());
        LoginMessage removeDoc = new LoginMessage();
        removeDoc.setMessage("Patient Profile Deleted Successfully");
        return removeDoc;
    }

    public List<Cases> getCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getCases(searchResultDTO.getSearchResult());
    }

    public List<Cases> getAllCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getAllCasesPatient(searchResultDTO.getUserName());
    }

    public List<Patient> getAllPatients() {
        return iPatientRegistrationRepository.findAll();
    }

    public OTP getOtp() {
        OTP otp = new OTP();
        Date date = new Date();

        String otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        iotpRepository.save(otp);
        return otp;
    }

    public LoginMessage validateOTP(OtpDTO otpDTO) {
        Date date = new Date();
        LoginMessage loginMessage = new LoginMessage();
        OTP otp = iotpRepository.getOTPValue(otpDTO.getOtp());
        if(otp != null && date.getTime() <= otp.getExpires()){
            loginMessage.setMessage("OTP Validated successfully, Login was Successful");
            iotpRepository.removeEntry(otpDTO.getOtp());
        }else{
            if(otp != null && date.getTime() > otp.getExpires()){
                iotpRepository.removeEntry(otpDTO.getOtp());
                loginMessage.setMessage("OTP expired!! Please retry");
            }else{
                loginMessage.setMessage("OTP entered is wrong!! Please renter");
            }
        }
        return loginMessage;
    }

    public Patient getPatientById(Integer patientId) {
        return iPatientRegistrationRepository.findByPatientId(patientId);
    }

    public LoginMessage updateCaseR(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());
        Radiologist radiologist = iRadiologistRegistrationRepository.getByRadiologistId(casesDTO.getRadiologistId());
        cases.setRadiologist(radiologist);
        iCasesRepository.save(cases);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Radiologist Assigned Successfully");
        return loginMessage;
    }

    public LoginMessage updateCaseL(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());
        Lab lab = iLabRegistrationRepository.getByLabId(casesDTO.getLabId());
        cases.setLab(lab);
        iCasesRepository.save(cases);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Lab Assigned Successfully");
        return loginMessage;
    }
}
