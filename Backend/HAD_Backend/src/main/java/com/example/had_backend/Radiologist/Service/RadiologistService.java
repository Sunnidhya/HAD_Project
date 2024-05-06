package com.example.had_backend.Radiologist.Service;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.*;
import com.example.had_backend.Global.Model.*;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Model.RadiologistChangePasswordDTO;
import com.example.had_backend.Radiologist.Model.RadiologistRegistrationDTO;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import com.example.had_backend.WebSecConfig.PasswordConfig;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RadiologistService {
    @Autowired
    private IRadiologistRegistrationRepository iRadiologistRegistrationRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IUsersRepository iUsersRepository;

    PasswordConfig passwordConfig = new PasswordConfig();
    public Users authenticateUser(LoginDTO login) {
        Users users = new Users();
        try {
            Users user1=iUsersRepository.findByUserNameAndPassword(login.getUserName());
            Boolean flag=passwordConfig.matches(login.getPassword(), user1.getPassword());
            if(flag){
                return user1;
            }else{
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }

    public LoginMessage register(RadiologistRegistrationDTO radiologistRegistrationDTO) {
        Radiologist radiologist = new Radiologist();

        Users userN = iUsersRepository.getProfile(radiologistRegistrationDTO.getUserName());
        if (userN!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }

        Radiologist radiologist2=iRadiologistRegistrationRepository.getRadiologist(radiologistRegistrationDTO.getUserName(),
                radiologistRegistrationDTO.getEmail());
        if (radiologist2 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        radiologist.setName(radiologistRegistrationDTO.getName());
        radiologist.setDegree(radiologistRegistrationDTO.getDegree());
        radiologist.setSpecialization(radiologistRegistrationDTO.getSpecialization());
        radiologist.setEmail(radiologistRegistrationDTO.getEmail());
        radiologist.setDepartment(radiologistRegistrationDTO.getDept());
        radiologist.setUserName(radiologistRegistrationDTO.getUserName());
        String hashedP = passwordConfig.encode(radiologistRegistrationDTO.getPassword());
        radiologist.setPassword(hashedP);
        iRadiologistRegistrationRepository.save(radiologist);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Radiologist profile(LoginDTO loginDTO) {
        return iRadiologistRegistrationRepository.getProfile(loginDTO.getUserName());
    }

    public LoginMessage changePassword(RadiologistChangePasswordDTO radiologistChangePasswordDTO) {
        Radiologist radiologist=iRadiologistRegistrationRepository.getProfile(radiologistChangePasswordDTO.getUserName());
        if (!Objects.equals(radiologist.getPassword(), radiologistChangePasswordDTO.getCurrentPassword())) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (radiologistChangePasswordDTO.getCurrentPassword().equals(radiologistChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        radiologist.setPassword(radiologistChangePasswordDTO.getNewPassword());
        iRadiologistRegistrationRepository.save(radiologist);
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removePatient(RadiologistRegistrationDTO radiologistRegistrationDTO) {
        Radiologist radiologist = iRadiologistRegistrationRepository
                .getRadiologist(radiologistRegistrationDTO.getUserName(), radiologistRegistrationDTO.getEmail());
        iRadiologistRegistrationRepository.delete(radiologist);
        LoginMessage removeDoc = new LoginMessage();
        removeDoc.setMessage("Radiologist Profile Deleted Successfully");
        return removeDoc;
    }

    public List<Cases> getCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getCases(searchResultDTO.getSearchResult());
    }

    public List<Cases> getAllCases(SearchResultDTO searchResultDTO) {
        List<Cases> cases = new ArrayList<>();
        Radiologist radiologist = iRadiologistRegistrationRepository.getProfile(searchResultDTO.getUserName());
        if(radiologist != null){
            Set<Cases> case1 = radiologist.getCases();
            cases = new ArrayList<>(case1);
        }
//        cases = iCasesRepository.getAllCasesRadiologist(searchResultDTO.getUserName());
        return cases;
    }

    public List<Radiologist> getAllRadiologists() {
        return iRadiologistRegistrationRepository.findAll();
    }

    public OTP getOtpUser(Radiologist radiologist) {
        OTP otp = new OTP();
        Date date = new Date();
        String otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        radiologist.setOtp(otp);
        iRadiologistRegistrationRepository.save(radiologist);
        return otp;
    }

    public LoginMessage validateOTP(OtpDTO otpDTO) {
        Date date = new Date();
        LoginMessage loginMessage = new LoginMessage();
        Radiologist radiologist = iRadiologistRegistrationRepository.getProfile(otpDTO.getUserName());

        if(radiologist.getOtp() != null && date.getTime() <= radiologist.getOtp().getExpires()){
            loginMessage.setMessage("OTP Validated successfully, Login was Successful");
            radiologist.setOtp(null);
            iRadiologistRegistrationRepository.save(radiologist);
        }else{
            if(radiologist.getOtp() != null && date.getTime() > radiologist.getOtp().getExpires()){
                radiologist.setOtp(null);
                iRadiologistRegistrationRepository.save(radiologist);
                loginMessage.setMessage("OTP expired!! Please retry");
            }else{
                loginMessage.setMessage("OTP entered is wrong!! Please renter");
            }
        }
        return loginMessage;
    }

    public LoginMessage updateRadioImpression(RadioImpressionDTO radioImpressionDTO){
        Cases cases = iCasesRepository.getCaseByCaseId(radioImpressionDTO.getCaseId());
        Radiologist radiologist = iRadiologistRegistrationRepository.getProfile(radioImpressionDTO.getRadioUserName());
        Integer radioId = radiologist.getUserId();
        for(Chats i:cases.getChats()){
            if(Objects.equals(i.getRadioId(), radioId)){
                i.setRadioImpression(radioImpressionDTO.getRadioImpression());
            }
        }
        iCasesRepository.save(cases);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Impression added successfully");
        return loginMessage;
    }

    public CasesDetailsDTO getCaseByCaseId(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());

        CasesDetailsDTO casesDetailsDTO = new CasesDetailsDTO();
        casesDetailsDTO.setCaseId(cases.getCaseId());
        casesDetailsDTO.setCaseName(cases.getCaseName());
        casesDetailsDTO.setCaseDate(cases.getCaseDate());
        casesDetailsDTO.setDoctorName(cases.getDoctor().getName());
        Set<Radiologist> radiologists = cases.getRadiologist();
        Radiologist radiologistV = null;
        for(Radiologist radiologist: radiologists){
            if(radiologist.getUserName().equals(casesDTO.getRadioUserName())){
                radiologistV = radiologist;
            }
        }
        if (radiologistV != null) {
            casesDetailsDTO.setRadioName(radiologistV.getName());
        } else {
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

        List<ChatsDTO> chatsDTOF = new ArrayList<>();
        for(Chats chats1: cases.getChats()){
            if(Objects.equals(chats1.getRadioId(), radiologistV != null ? radiologistV.getUserId() : null)){
                ChatsDTO chatsDTO = new ChatsDTO();
                chatsDTO.setRadioId(chats1.getRadioId());
                chatsDTO.setRadioName(chats1.getRadioName());
                chatsDTO.setRadioImpression(chats1.getRadioImpression());
                List<ThreadsDTO> threadsF = new ArrayList<>();
                for(Threads threads1: chats1.getThreads()){
                    ThreadsDTO threadsDTO = new ThreadsDTO();
                    threadsDTO.setText(threads1.getText());
                    threadsDTO.setTimeStamp(threads1.getTimeStamp());
                    threadsDTO.setImageURL(threads1.getImageURL());
                    threadsDTO.setUserName(threads1.getUserName());
                    threadsF.add(threadsDTO);
                }
                chatsDTO.setThreadsDTO(threadsF);
                chatsDTOF.add(chatsDTO);
            }
        }
        casesDetailsDTO.setThreads(chatsDTOF);

        if(cases.getImageOb() != null){
            if(cases.getImageOb().getFinalDiagnosis() != null){
                casesDetailsDTO.setAge(cases.getImageOb().getFinalDiagnosis().getAge());
                casesDetailsDTO.setConclusion(cases.getImageOb().getFinalDiagnosis().getConclusion());
                casesDetailsDTO.setStatus(cases.getImageOb().getFinalDiagnosis().getStatus());
                casesDetailsDTO.setTherapy(cases.getImageOb().getFinalDiagnosis().getTherapy());
                casesDetailsDTO.setMedicalHistory(cases.getImageOb().getFinalDiagnosis().getMedicalHistory());
                casesDetailsDTO.setRadiologistConclusion(cases.getImageOb().getFinalDiagnosis().getRadiologistConclusion());
                casesDetailsDTO.setTreatmentRecommendation(cases.getImageOb().getFinalDiagnosis().getTreatmentRecommendations());
                casesDetailsDTO.setSurgery(cases.getImageOb().getFinalDiagnosis().getSurgery());
            }
            casesDetailsDTO.setPrescriptionURL(cases.getImageOb().getPrescriptionURL());
            casesDetailsDTO.setScannedImageURL(cases.getImageOb().getScannedImageURL());
        }
        return casesDetailsDTO;
    }
}
