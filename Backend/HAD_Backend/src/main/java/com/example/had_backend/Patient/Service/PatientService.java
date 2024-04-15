package com.example.had_backend.Patient.Service;


import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.CasesDetailsDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Model.PatientChangePasswordDTO;
import com.example.had_backend.Patient.Model.RegisterDTO;
import com.example.had_backend.Patient.Repository.IPatientRegistrationRepository;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import com.example.had_backend.WebSecConfig.PasswordConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class PatientService {
    @Autowired
    private IPatientRegistrationRepository iPatientRegistrationRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IRadiologistRegistrationRepository iRadiologistRegistrationRepository;

    @Autowired
    private ILabRegistrationRepository iLabRegistrationRepository;

    @Autowired
    private IUsersRepository iUsersRepository;

    private PasswordConfig passwordConfig = new PasswordConfig();

    public Users authenticateUser(LoginDTO login) {
        Users users = new Users();
        try {
            Users user1 = iUsersRepository.findByUserNameAndPassword(login.getUserName());
            Boolean flag = passwordConfig.matches(login.getPassword(), user1.getPassword());
            if(flag)
            {
                return user1;
            }else{
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }

    public LoginMessage registerPatient(RegisterDTO register) {
        Patient patient = new Patient();

        Users userN = iUsersRepository.getProfile(register.getUserName());
        if (userN!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }

        Patient patient2=iPatientRegistrationRepository.getPatientProfile(register.getUserName(),register.getEmail());
        if (patient2 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        patient.setAddress(register.getAddress());
        patient.setContactNo(register.getContactNo());
        patient.setEmail(register.getEmail());
        patient.setFullName(register.getFullName());
        patient.setUserName(register.getUserName());
        String hashedP = passwordConfig.encode(register.getPassword());
        patient.setPassword(hashedP);
        patient.setPassword(register.getPassword());
        iPatientRegistrationRepository.save(patient);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Patient getProfile(LoginDTO loginDTO) {
        return iPatientRegistrationRepository.getPatientProfileDetails(loginDTO.getUserName());
    }

    public LoginMessage changePassword(PatientChangePasswordDTO patientChangePasswordDTO) {
        Patient patient=iPatientRegistrationRepository.getPatientProfileDetails(patientChangePasswordDTO.getUserName());
        if (!Objects.equals(patient.getPassword(), patientChangePasswordDTO.getCurrentPassword())) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (patientChangePasswordDTO.getCurrentPassword().equals(patientChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        patient.setPassword(patientChangePasswordDTO.getNewPassword());
        iPatientRegistrationRepository.save(patient);
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removePatient(RegisterDTO registerDTO) {
        Patient patient = iPatientRegistrationRepository
                .getPatientProfile(registerDTO.getUserName(), registerDTO.getEmail());
        iPatientRegistrationRepository.delete(patient);
        LoginMessage removePat = new LoginMessage();
        removePat.setMessage("Patient Profile Deleted Successfully");
        return removePat;
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

    public OTP getOtpUser(Patient patient) {
        OTP otp = new OTP();
        Date date = new Date();
        String otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        patient.setOtp(otp);
        iPatientRegistrationRepository.save(patient);
        return otp;
    }

    public LoginMessage validateOTP(OtpDTO otpDTO) {
        Date date = new Date();
        LoginMessage loginMessage = new LoginMessage();
        Patient patient = iPatientRegistrationRepository.getPatientProfileDetails(otpDTO.getUserName());

        if(patient.getOtp() != null && date.getTime() <= patient.getOtp().getExpires()){
            loginMessage.setMessage("OTP Validated successfully, Login was Successful");
            patient.setOtp(null);
            iPatientRegistrationRepository.save(patient);
        }else{
            if(patient.getOtp() != null && date.getTime() > patient.getOtp().getExpires()){
                patient.setOtp(null);
                iPatientRegistrationRepository.save(patient);
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

    public Patient getPatientByUserName(String patientUserName) {
        return iPatientRegistrationRepository.findByPatientUserName(patientUserName);
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

    public CasesDetailsDTO getCaseByCaseId(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());

        CasesDetailsDTO casesDetailsDTO = new CasesDetailsDTO();
        casesDetailsDTO.setCaseId(cases.getCaseId());
        casesDetailsDTO.setCaseName(cases.getCaseName());
        casesDetailsDTO.setCaseDate(cases.getCaseDate());
        casesDetailsDTO.setDoctorName(cases.getDoctor().getName());
        if(cases.getRadiologist() != null) {
            casesDetailsDTO.setRadioName(cases.getRadiologist().getName());
        }else{
            casesDetailsDTO.setRadioName("Not yet assigned");
        }
        if(cases.getLab() != null) {
            casesDetailsDTO.setLabName(cases.getLab().getLabName());
        }else{
            casesDetailsDTO.setLabName("Not yet assigned");
        }
        casesDetailsDTO.setPatientName(cases.getPatient().getFullName());
        casesDetailsDTO.setMarkAsDone(cases.getMarkAsDone());
        casesDetailsDTO.setCaseDescription(cases.getCaseDescription());
        casesDetailsDTO.setAge(cases.getImageOb().getFinalDiagnosis().getAge());
        casesDetailsDTO.setConclusion(cases.getImageOb().getFinalDiagnosis().getConclusion());
        casesDetailsDTO.setStatus(cases.getImageOb().getFinalDiagnosis().getStatus());
        casesDetailsDTO.setTherapy(cases.getImageOb().getFinalDiagnosis().getTherapy());
        casesDetailsDTO.setMedicalHistory(cases.getImageOb().getFinalDiagnosis().getMedicalHistory());
        casesDetailsDTO.setRadiologistConclusion(cases.getImageOb().getFinalDiagnosis().getRadiologistConclusion());
        casesDetailsDTO.setTreatmentRecommendation(cases.getImageOb().getFinalDiagnosis().getTreatmentRecommendations());
        casesDetailsDTO.setPrescriptionURL(cases.getImageOb().getPrescriptionURL());
        casesDetailsDTO.setScannedImageURL(cases.getImageOb().getScannedImageURL());
        casesDetailsDTO.setSurgery(cases.getImageOb().getFinalDiagnosis().getSurgery());
        return casesDetailsDTO;
    }
}
