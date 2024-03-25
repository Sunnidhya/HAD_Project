package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Repository.IDoctorLoginRepository;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Global.Entity.Cases;
import com.example.had_backend.Global.Entity.UserName;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IUserNameRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Doctor profile(Doctor doctor3) {

        return iDoctorRegistrationRepository.getProfile(doctor3.getUserName());
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
}
