package com.example.had_backend.Global.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Entity.DoctorL;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Repository.IDoctorLoginRepository;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Entity.OTP;
import com.example.had_backend.Global.Entity.UserName;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Repository.IOTPRepository;
import com.example.had_backend.Global.Repository.IUserNameRepository;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Repository.IPatientRegistrationRepository;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class GlobalService {
    @Autowired
    private IDoctorRegistrationRepository doctorRepository;
    @Autowired
    private IRadiologistRegistrationRepository radiologistRepository;
    @Autowired
    private ILabRegistrationRepository labRepository;
    @Autowired
    private IPatientRegistrationRepository patientRepository;
    @Autowired
    private IOTPRepository iotpRepository;
    @Autowired
    private OTPHelperService otpHelperService;

    @Autowired
    public GlobalService(IDoctorRegistrationRepository doctorRepository, IRadiologistRegistrationRepository radiologistRepository,
                         ILabRegistrationRepository labRepository, IPatientRegistrationRepository patientRepository) {
        this.doctorRepository = doctorRepository;
        this.radiologistRepository = radiologistRepository;
        this.labRepository = labRepository;
        this.patientRepository = patientRepository;
    }

    public int getCountDoctors() {
        List<Doctor> obj1= doctorRepository.getCountDoctors();
        return obj1.size();
    }

    public int getCountRadiologist() {
        List<Radiologist> obj2= radiologistRepository.getCountRadiologist();
        return obj2.size();
    }

    public int getCountLab() {
        List<Lab> obj3 = labRepository.getCountLab();
        return obj3.size();
    }

    public int getCountPatient() {
        List<Patient> obj4 = patientRepository.getCountPatient();
        return obj4.size();
    }
}
