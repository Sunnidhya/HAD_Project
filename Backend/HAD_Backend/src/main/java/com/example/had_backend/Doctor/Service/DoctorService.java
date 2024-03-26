package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Repository.IDoctorLoginRepository;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class DoctorService {
    @Autowired
    private IDoctorLoginRepository iDoctorLoginRepository;

    @Autowired
    private IDoctorRegistrationRepository iDoctorRegistrationRepository;

    @Autowired
    private IUserNameRepository iUserNameRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IOTPRepository iotpRepository;

    public DoctorL authenticate(LoginDTO loginDTO) {
        DoctorL doctorL = new DoctorL();
        try {
            doctorL = iDoctorLoginRepository.findByEmailAndPassword(loginDTO.getUserName() , loginDTO.getPassword());
            return doctorL;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return doctorL;
    }

    public LoginMessage register(DoctorRegistrationDTO doctorRegistrationDTO) {
        Doctor doctor = new Doctor();
        DoctorL doctorL = new DoctorL();
        UserName userName = new UserName();

        UserName userName1 = iUserNameRepository.getProfile(doctorRegistrationDTO.getUserName());
        if (userName1!=null){
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("UserName already exists");
            return loginMessage;
        }

        Doctor doctor2=iDoctorRegistrationRepository.getDoctor(doctorRegistrationDTO.getUserName(),doctorRegistrationDTO.getEmail());
        if (doctor2 != null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("User is already registered");
            return loginMsg;
        }

        doctor.setName(doctorRegistrationDTO.getName());
        doctor.setDegree(doctorRegistrationDTO.getDegree());
        doctor.setSpecialization(doctorRegistrationDTO.getSpecialization());
        doctor.setEmail(doctorRegistrationDTO.getEmail());
        doctor.setUserName(doctorRegistrationDTO.getUserName());
        doctor.setDepartment(doctorRegistrationDTO.getDept());

        doctorL.setUserName(doctorRegistrationDTO.getUserName());
        doctorL.setPassword(doctorRegistrationDTO.getPassword());
        doctorL.setDoctor(doctor);


        iDoctorLoginRepository.save(doctorL);

        doctor.setDoctorL(doctorL);
        iDoctorRegistrationRepository.save(doctor);

        userName.setUserName(doctorRegistrationDTO.getUserName());
        iUserNameRepository.save(userName);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Doctor profile(LoginDTO loginDTO) {
        return iDoctorRegistrationRepository.getProfile(loginDTO.getUserName());
    }

    public LoginMessage changePassword(DoctorChangePasswordDTO doctorChangePasswordDTO) {

        DoctorL doctorL1=iDoctorLoginRepository.findByEmailAndPassword(doctorChangePasswordDTO.getUserName(),doctorChangePasswordDTO.getCurrentPassword());
        Doctor doctor=iDoctorRegistrationRepository.getProfile(doctorChangePasswordDTO.getUserName());
        if (doctorL1 == null) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (doctorChangePasswordDTO.getCurrentPassword().equals(doctorChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        iDoctorLoginRepository.changePassword(doctorChangePasswordDTO.getUserName(),doctorChangePasswordDTO.getNewPassword());
        doctorChangePasswordDTO.setEmail(doctor.getEmail());
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removeDoctor(DoctorRegistrationDTO doctorRegistrationDTO) {
        Doctor doctor = iDoctorRegistrationRepository
                .getDoctor(doctorRegistrationDTO.getUserName(), doctorRegistrationDTO.getEmail());


        iDoctorLoginRepository.updateAndSetDocIdNull(doctor.getDoctorId());
        iDoctorRegistrationRepository.removeEntry(doctor.getDoctorId());
        LoginMessage removeDoc = new LoginMessage();
        removeDoc.setMessage("Doctor Profile Deleted Successfully");
        return removeDoc;
    }

    public List<Cases> getCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getCases(searchResultDTO.getSearchResult());
    }

    public List<Cases> getAllCases(SearchResultDTO searchResultDTO) {
        return iCasesRepository.getAllCasesDoctor(searchResultDTO.getUserName());
    }

    public List<Doctor> getAllDoctors() {
        return iDoctorRegistrationRepository.findAll();
    }

    public LoginMessage createCase(Cases cases) {
        iCasesRepository.save(cases);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Case is created successfully");
        return loginMessage;
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
            loginMessage.setMessage("OTP Validated successfully");
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
