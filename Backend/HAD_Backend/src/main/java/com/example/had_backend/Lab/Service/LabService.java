package com.example.had_backend.Lab.Service;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.ImageOb;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Model.UploadImagesDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Model.LabChangePasswordDTO;
import com.example.had_backend.Lab.Model.LabRegistrationDTO;
import com.example.had_backend.Lab.Model.LabSendOTPDTO;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.WebSecConfig.PasswordConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class LabService {

    @Autowired
    private ILabRegistrationRepository iLabRegistrationRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IUsersRepository iUsersRepository;

    private PasswordConfig passwordConfig = new PasswordConfig();

    public Users authenticateUser(LoginDTO login) {
        Users users = new Users();
        try {
            Users user1 = iUsersRepository.findByUserNameAndPassword(login.getUserName());
            Boolean flag = passwordConfig.matches(login.getPassword(), user1.getPassword());
            if(flag){
                return user1;
            }else{
                return null;            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }

    public LoginMessage registerLab(LabRegistrationDTO labRegistrationDTO) {
        Lab lab = new Lab();

        Users usersN = iUsersRepository.getProfile(labRegistrationDTO.getUserName());
        if (usersN!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }

        Lab lab2=iLabRegistrationRepository.getLab(labRegistrationDTO.getUserName(),labRegistrationDTO.getEmail());
        if (lab2 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        lab.setLabName(labRegistrationDTO.getLabName());
        lab.setContactNo(labRegistrationDTO.getContactNo());
        lab.setEmail(labRegistrationDTO.getEmail());
        lab.setUserName(labRegistrationDTO.getUserName());
        String hashedP = passwordConfig.encode(labRegistrationDTO.getPassword());
        lab.setPassword(hashedP);
        iLabRegistrationRepository.save(lab);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Lab getProfile(LoginDTO loginDTO) {
        return iLabRegistrationRepository.getProfile(loginDTO.getUserName());
    }

    public LoginMessage changePassword(LabChangePasswordDTO labChangePasswordDTO) {
        Lab lab = iLabRegistrationRepository.getProfile(labChangePasswordDTO.getUserName());
        if (!Objects.equals(lab.getPassword(), labChangePasswordDTO.getCurrentPassword())) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (labChangePasswordDTO.getCurrentPassword().equals(labChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        lab.setPassword(labChangePasswordDTO.getNewPassword());
        iLabRegistrationRepository.save(lab);
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removeLab(LabRegistrationDTO labRegistrationDTO) {
        Lab lab = iLabRegistrationRepository
                .getLab(labRegistrationDTO.getUserName(), labRegistrationDTO.getEmail());
        iLabRegistrationRepository.delete(lab);
        LoginMessage removeLab = new LoginMessage();
        removeLab.setMessage("Lab Profile Deleted Successfully");
        return removeLab;
    }

    public List<Cases> getCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getCases(searchResultDTO.getSearchResult());
    }

    public List<Cases> getAllCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getAllCasesLab(searchResultDTO.getUserName());
    }

    public List<Lab> getAllLabs() {
        return iLabRegistrationRepository.findAll();
    }

    public OTP getOtp(Lab lab) {
        OTP otp = new OTP();
        Date date = new Date();
        String otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        lab.setOtp(otp);
        iLabRegistrationRepository.save(lab);
        return otp;
    }

    public LoginMessage validateOTP(OtpDTO otpDTO) {
        Date date = new Date();
        LoginMessage loginMessage = new LoginMessage();
        Lab lab = iLabRegistrationRepository.getProfile(otpDTO.getUserName());

        if(lab.getOtp() != null && date.getTime() <= lab.getOtp().getExpires()){
            loginMessage.setMessage("OTP Validated successfully, Login was Successful");
            lab.setOtp(null);
            iLabRegistrationRepository.save(lab);
        }else {
            if (lab.getOtp() != null && date.getTime() > lab.getOtp().getExpires()) {
                lab.setOtp(null);
                iLabRegistrationRepository.save(lab);
                loginMessage.setMessage("OTP expired!! Please retry");
            } else {
                loginMessage.setMessage("OTP entered is wrong!! Please renter");
            }
        }
        return loginMessage;
    }

    public Cases getCaseByCaseId(Integer caseIdVal){
        return iCasesRepository.getCaseByCaseId(caseIdVal);
    }

    public LoginMessage uploadImages(UploadImagesDTO uploadImagesDTO) {
        LoginMessage loginMessage = new LoginMessage();
        Cases cases = iCasesRepository.getCaseByCaseId(uploadImagesDTO.getCaseId());
        Users patient = iUsersRepository.getProfile(cases.getPatient().getUserName());
        if(!patient.getOtp().getOneTimePasswordCode().equals(uploadImagesDTO.getOtp())){
            loginMessage.setMessage("OTP entered is wrong, please recheck!!");
            return loginMessage;
        }
        Date date = new Date();
        if(patient.getOtp() != null && date.getTime() <= patient.getOtp().getExpires()){
            patient.setOtp(null);
            iUsersRepository.save(patient);
            ImageOb imageOb = new ImageOb();
            imageOb.setPrescriptionURL(uploadImagesDTO.getPrescriptionURL());
            imageOb.setScannedImageURL(uploadImagesDTO.getScannedImageURL());
            cases.setImageOb(imageOb);
            iCasesRepository.save(cases);
            loginMessage.setMessage("Images uploaded successfully");
            return loginMessage;
        }else {
            if (patient.getOtp() != null && date.getTime() > patient.getOtp().getExpires()) {
                patient.setOtp(null);
                iUsersRepository.save(patient);
                loginMessage.setMessage("OTP expired!! Please retry");
                return loginMessage;
            } else {
                loginMessage.setMessage("OTP entered is wrong!! Please renter");
                return loginMessage;
            }
        }
    }

    public LabSendOTPDTO sendOTP(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());
        Users patient = iUsersRepository.getProfile(cases.getPatient().getUserName());
        OTP otp = new OTP();
        Date date = new Date();
        String otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        patient.setOtp(otp);
        iUsersRepository.save(patient);
        LabSendOTPDTO labSendOTPDTO = new LabSendOTPDTO();
        labSendOTPDTO.setEmail(cases.getPatient().getEmail());
        labSendOTPDTO.setOtp(otp);
        return labSendOTPDTO;
    }
}
