package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Repository.IDoctorLoginRepository;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Patient.Entity.PatientL;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Repository.IPatientLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.print.Doc;

@Service
public class DoctorService {
    @Autowired
    private IDoctorLoginRepository iDoctorLoginRepository;

    @Autowired
    private IDoctorRegistrationRepository iDoctorRegistrationRepository;

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

        Doctor doctor2=iDoctorRegistrationRepository.getDoctor(doctorRegistrationDTO.getUserName());
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
        iDoctorRegistrationRepository.save(doctor);

        Doctor doctor1=iDoctorRegistrationRepository.getDoctor(doctorRegistrationDTO.getUserName());
        doctorL.setDoctorId(doctor1.getDoctorId());
        doctorL.setUserName(doctorRegistrationDTO.getUserName());
        doctorL.setPassword(doctorRegistrationDTO.getPassword());
        iDoctorLoginRepository.save(doctorL);

        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Registration Successful");
        return loginMessage;
    }

    public Doctor profile(Doctor doctor3) {
        return iDoctorRegistrationRepository.getDoctor(doctor3.getUserName());

    }
}
