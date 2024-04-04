package com.example.had_backend.Radiologist.Service;

import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Model.RadiologistChangePasswordDTO;
import com.example.had_backend.Radiologist.Model.RadiologistRegistrationDTO;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

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

    public Users authenticateUser(LoginDTO login) {
        Users users = new Users();
        try {
            return iUsersRepository.findByUserNameAndPassword(login.getUserName() , login.getPassword());
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
        radiologist.setPassword(radiologistRegistrationDTO.getPassword());
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
        return iCasesRepository.getAllCasesRadiologist(searchResultDTO.getUserName());
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
            loginMessage.setMessage("OTP Validated successfully");
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
}
