package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Model.CasesDTO;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
public class DoctorService {
    @Autowired
    private IDoctorRegistrationRepository iDoctorRegistrationRepository;

    @Autowired
    private ICasesRepository iCasesRepository;

    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    private IUsersRepository iUsersRepository;

    public LoginMessage register(DoctorRegistrationDTO doctorRegistrationDTO) {
        Doctor doctor = new Doctor();

        Users userN = iUsersRepository.getProfile(doctorRegistrationDTO.getUserName());
        if (userN!=null){
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
        doctor.setDepartment(doctorRegistrationDTO.getDept());
        doctor.setUserName(doctorRegistrationDTO.getUserName());
        doctor.setPassword(doctorRegistrationDTO.getPassword());
        iDoctorRegistrationRepository.save(doctor);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Doctor profile(LoginDTO loginDTO) {
        return iDoctorRegistrationRepository.getProfile(loginDTO.getUserName());
    }

    public LoginMessage changePassword(DoctorChangePasswordDTO doctorChangePasswordDTO) {
        Doctor doctor=iDoctorRegistrationRepository.getProfile(doctorChangePasswordDTO.getUserName());
        if (!Objects.equals(doctor.getPassword(), doctorChangePasswordDTO.getCurrentPassword())) {
            LoginMessage loginMsg = new LoginMessage();
            loginMsg.setMessage("Current Password or User Name entered wrongly ");
            return loginMsg;
        } else if (doctorChangePasswordDTO.getCurrentPassword().equals(doctorChangePasswordDTO.getNewPassword())) {
            LoginMessage loginMessage = new LoginMessage();
            loginMessage.setMessage("Same Password entered");
            return loginMessage;
        }

        doctor.setPassword(doctorChangePasswordDTO.getNewPassword());
        iDoctorRegistrationRepository.save(doctor);
        LoginMessage loginMsg = new LoginMessage();
        loginMsg.setMessage("Password updated successfully");
        return loginMsg;
    }

    public LoginMessage removeDoctor(DoctorRegistrationDTO doctorRegistrationDTO) {
        Doctor doctor = iDoctorRegistrationRepository
                .getDoctor(doctorRegistrationDTO.getUserName(), doctorRegistrationDTO.getEmail());
        iDoctorRegistrationRepository.delete(doctor);
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
        Date date = new Date();
        cases.setCaseDate(date.getTime());
        iCasesRepository.save(cases);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Case is created successfully");
        return loginMessage;
    }

    public LoginMessage createCaseN(Cases cases, Doctor doctor) {
        Date date = new Date();
        cases.setCaseDate(date.getTime());
        iCasesRepository.save(cases);
        doctor.getCases().add(cases);
        iDoctorRegistrationRepository.save(doctor);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Case is created successfully");
        return loginMessage;
    }

    public LoginMessage validateOTP(OtpDTO otpDTO) {
        Date date = new Date();
        LoginMessage loginMessage = new LoginMessage();
        Doctor doctor = iDoctorRegistrationRepository.getProfile(otpDTO.getUserName());

        if(doctor.getOtp() != null && date.getTime() <= doctor.getOtp().getExpires()){
            loginMessage.setMessage("OTP Validated successfully");
            doctor.setOtp(null);
            iDoctorRegistrationRepository.save(doctor);
        }else{
            if(doctor.getOtp() != null && date.getTime() > doctor.getOtp().getExpires()){
                doctor.setOtp(null);
                iDoctorRegistrationRepository.save(doctor);
                loginMessage.setMessage("OTP expired!! Please retry");
            }else{
                loginMessage.setMessage("OTP entered is wrong!! Please renter");
            }
        }
        return loginMessage;
    }

    public Doctor getDoctorById(Integer doctorId) {
        return iDoctorRegistrationRepository.findByDoctorId(doctorId);
    }

    public Doctor getDoctorByUserName(String doctorUserName) {
        return iDoctorRegistrationRepository.findByDoctorUserName(doctorUserName);
    }

    public LoginMessage markAsDone(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());
        cases.setMarkAsDone(true);
        iCasesRepository.save(cases);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Case is Marked as done and closed");
        return loginMessage;
    }

    public Users authenticateUser(LoginDTO login) {
        Users users = new Users();
        try {
            return iUsersRepository.findByUserNameAndPassword(login.getUserName() , login.getPassword());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }

    public OTP getOtpUser(Doctor doctor) {
        OTP otp = new OTP();
        Date date = new Date();
        String otpV = otpHelperService.createRandomOneTimePassword();
        otp.setOneTimePasswordCode(otpV);
        otp.setExpires(date.getTime()+5*60*1000);//5 minute OTP expiration time.
        doctor.setOtp(otp);
        iDoctorRegistrationRepository.save(doctor);
        return otp;
    }
}
