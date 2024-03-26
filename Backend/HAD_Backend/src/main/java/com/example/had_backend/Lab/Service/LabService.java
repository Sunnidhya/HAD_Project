package com.example.had_backend.Lab.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.UserName;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IOTPRepository;
import com.example.had_backend.Global.Repository.IUserNameRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Entity.Labl;
import com.example.had_backend.Lab.Model.LabChangePasswordDTO;
import com.example.had_backend.Lab.Model.LabRegistrationDTO;
import com.example.had_backend.Lab.Repository.ILabLoginRepository;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class LabService {

    @Autowired
    private ILabLoginRepository iLabLoginRepository;

    @Autowired
    private ILabRegistrationRepository iLabRegistrationRepository;

    @Autowired
    private IUserNameRepository iUserNameRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IOTPRepository iotpRepository;

    public Labl authenticate(LoginDTO loginDTO) {
        Labl labl = new Labl();
        try {
            labl = iLabLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return labl;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return labl;
    }

    public LoginMessage registerLab(LabRegistrationDTO labRegistrationDTO) {
        Lab lab = new Lab();
        Labl labl = new Labl();
        UserName userName = new UserName();

        UserName userName1 = iUserNameRepository.getProfile(labRegistrationDTO.getUserName());
        if (userName1!=null){
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

        labl.setUserName(labRegistrationDTO.getUserName());
        labl.setPassword(labRegistrationDTO.getPassword());
        labl.setLab(lab);

        iLabLoginRepository.save(labl);

        lab.setLabl(labl);
        iLabRegistrationRepository.save(lab);

        userName.setUserName(labRegistrationDTO.getUserName());
        iUserNameRepository.save(userName);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Lab getProfile(LoginDTO loginDTO) {
        return iLabRegistrationRepository.getProfile(loginDTO.getUserName());
    }

    public LoginMessage changePassword(LabChangePasswordDTO labChangePasswordDTO) {
        Labl labl1 = iLabLoginRepository.findByEmailAndPassword(labChangePasswordDTO.getUserName(),labChangePasswordDTO.getCurrentPassword());
        Lab lab = iLabRegistrationRepository.getProfile(labChangePasswordDTO.getUserName());

        if (labl1 == null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (labChangePasswordDTO.getCurrentPassword().equals(labChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        iLabLoginRepository.changePassword(labChangePasswordDTO.getUserName(),labChangePasswordDTO.getNewPassword());
        labChangePasswordDTO.setEmail(lab.getEmail());
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removeLab(LabRegistrationDTO labRegistrationDTO) {
        Lab lab = iLabRegistrationRepository
                .getLab(labRegistrationDTO.getUserName(), labRegistrationDTO.getEmail());


        iLabLoginRepository.updateAndSetDocIdNull(lab.getLabId());
        iLabRegistrationRepository.removeEntry(lab.getLabId());
        LoginMessage removeDoc = new LoginMessage();
        removeDoc.setMessage("Lab Profile Deleted Successfully");
        return removeDoc;
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

    public OtpDTO getOtp() {
        OtpDTO otpDTO = new OtpDTO();
        OTP otp = new OTP();
        Date date = new Date();

        Integer otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        iotpRepository.save(otp);

        otpDTO.setOtp(otpV);
        return otpDTO;
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
}
