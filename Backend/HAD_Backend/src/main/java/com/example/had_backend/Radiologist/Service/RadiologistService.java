package com.example.had_backend.Radiologist.Service;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.UserName;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IOTPRepository;
import com.example.had_backend.Global.Repository.IUserNameRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Entity.RadiologistL;
import com.example.had_backend.Radiologist.Model.RadiologistChangePasswordDTO;
import com.example.had_backend.Radiologist.Model.RadiologistRegistrationDTO;
import com.example.had_backend.Radiologist.Repository.IRadiologistLoginRepository;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class RadiologistService {

    @Autowired
    private IRadiologistLoginRepository iRadiologistLoginRepository;

    @Autowired
    private IRadiologistRegistrationRepository iRadiologistRegistrationRepository;

    @Autowired
    private IUserNameRepository iUserNameRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IOTPRepository iotpRepository;

    public RadiologistL authenticate(LoginDTO loginDTO) {
        RadiologistL radiologistL = new RadiologistL();
        try {
            radiologistL = iRadiologistLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return radiologistL;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return radiologistL;
    }

    public LoginMessage register(RadiologistRegistrationDTO radiologistRegistrationDTO) {

        Radiologist radiologist = new Radiologist();
        RadiologistL radiologistL = new RadiologistL();
        UserName userName = new UserName();

        UserName userName1 = iUserNameRepository.getProfile(radiologistRegistrationDTO.getUserName());
        if (userName1!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }

        Radiologist radiologist2=iRadiologistRegistrationRepository.getRadiologist(radiologistRegistrationDTO.getUserName(),radiologistRegistrationDTO.getEmail());
        if (radiologist2 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        radiologist.setName(radiologistRegistrationDTO.getName());
        radiologist.setDegree(radiologistRegistrationDTO.getDegree());
        radiologist.setSpecialization(radiologistRegistrationDTO.getSpecialization());
        radiologist.setEmail(radiologistRegistrationDTO.getEmail());
        radiologist.setUserName(radiologistRegistrationDTO.getUserName());
        radiologist.setDepartment(radiologistRegistrationDTO.getDept());

        radiologistL.setUserName(radiologistRegistrationDTO.getUserName());
        radiologistL.setPassword(radiologistRegistrationDTO.getPassword());
        radiologistL.setRadiologist(radiologist);

        iRadiologistLoginRepository.save(radiologistL);

        radiologist.setRadiologistL(radiologistL);
        iRadiologistRegistrationRepository.save(radiologist);

        userName.setUserName(radiologistRegistrationDTO.getUserName());
        iUserNameRepository.save(userName);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Radiologist profile(LoginDTO loginDTO) {
        return iRadiologistRegistrationRepository.getProfile(loginDTO.getUserName());
    }

    public LoginMessage changePassword(RadiologistChangePasswordDTO radiologistChangePasswordDTO) {
        RadiologistL radiologistL=iRadiologistLoginRepository.findByEmailAndPassword(radiologistChangePasswordDTO.getUserName(),radiologistChangePasswordDTO.getCurrentPassword());
        Radiologist radiologist=iRadiologistRegistrationRepository.getProfile(radiologistChangePasswordDTO.getUserName());

        if (radiologistL == null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (radiologistChangePasswordDTO.getCurrentPassword().equals(radiologistChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        iRadiologistLoginRepository.changePassword(radiologistChangePasswordDTO.getUserName(),radiologistChangePasswordDTO.getNewPassword());
        radiologistChangePasswordDTO.setEmail(radiologist.getEmail());
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removePatient(RadiologistRegistrationDTO radiologistRegistrationDTO) {
        Radiologist radiologist = iRadiologistRegistrationRepository
                .getRadiologist(radiologistRegistrationDTO.getUserName(), radiologistRegistrationDTO.getEmail());


        iRadiologistLoginRepository.updateAndSetRadiologistIdNull(radiologist.getRadiologistId());
        iRadiologistRegistrationRepository.removeEntry(radiologist.getRadiologistId());
        LoginMessage removeDoc = new LoginMessage();
        removeDoc.setMessage("Patient Profile Deleted Successfully");
        return removeDoc;
    }

    public List<Cases> getCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getCases(searchResultDTO.getSearchResult());
    }

    public List<Cases> getAllCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getAllCasesRadiologist(searchResultDTO.getUserName());
    }

    public List<Radiologist> getAllRadiologists() {
        return iRadiologistRegistrationRepository.findAll();
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
}
