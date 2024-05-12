package com.example.had_backend.Global.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Global.Entity.Users;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Lab.Entity.Lab;
import com.example.had_backend.Lab.Repository.ILabRegistrationRepository;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Patient.Entity.Patient;
import com.example.had_backend.Patient.Repository.IPatientRegistrationRepository;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private IUsersRepository iUsersRepository;

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

    public Users authenticateUser(LoginDTO login) {
        Users users = new Users();
        try {
            return iUsersRepository.findByUserNameAndPassword(login.getUserName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return users;
    }
}
