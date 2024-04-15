package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Global.Entity.*;
import com.example.had_backend.Global.Model.*;
import com.example.had_backend.Global.Repository.ICasesRepository;
import com.example.had_backend.Global.Repository.IChatRepository;
import com.example.had_backend.Global.Repository.IThreadRepository;
import com.example.had_backend.Global.Repository.IUsersRepository;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    @Autowired
    private IThreadRepository iThreadRepository;

    @Autowired
    private IChatRepository iChatRepository;

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

    public CasesDetailsDTO getCaseByCaseId(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());

        CasesDetailsDTO casesDetailsDTO = new CasesDetailsDTO();
        casesDetailsDTO.setCaseId(cases.getCaseId());
        casesDetailsDTO.setCaseName(cases.getCaseName());
        casesDetailsDTO.setCaseDate(cases.getCaseDate());
        casesDetailsDTO.setDoctorName(cases.getDoctor().getName());
        if(cases.getRadiologist() != null) {
            casesDetailsDTO.setRadioName(cases.getRadiologist().getName());
        }else{
            casesDetailsDTO.setRadioName("Not yet assigned");
        }
        if(cases.getLab() != null) {
            casesDetailsDTO.setLabName(cases.getLab().getLabName());
        }else{
            casesDetailsDTO.setLabName("Not yet assigned");
        }
        casesDetailsDTO.setPatientName(cases.getPatient().getFullName());
        casesDetailsDTO.setMarkAsDone(cases.getMarkAsDone());
        casesDetailsDTO.setCaseDescription(cases.getCaseDescription());
        List<ThreadsDTO> threadsF = new ArrayList<>();
        for(Threads threads: cases.getChats().getThreads()){
            ThreadsDTO threadsDTO = new ThreadsDTO();
            threadsDTO.setText(threads.getText());
            threadsDTO.setTimeStamp(threads.getTimeStamp());
            threadsDTO.setImageURL(threads.getImageURL());
            threadsDTO.setUserName(threads.getUserName());
            threadsF.add(threadsDTO);
        }
        casesDetailsDTO.setThreads(threadsF);

        if(cases.getImageOb() != null){
            if(cases.getImageOb().getFinalDiagnosis() != null){
                casesDetailsDTO.setAge(cases.getImageOb().getFinalDiagnosis().getAge());
                casesDetailsDTO.setConclusion(cases.getImageOb().getFinalDiagnosis().getConclusion());
                casesDetailsDTO.setStatus(cases.getImageOb().getFinalDiagnosis().getStatus());
                casesDetailsDTO.setTherapy(cases.getImageOb().getFinalDiagnosis().getTherapy());
                casesDetailsDTO.setMedicalHistory(cases.getImageOb().getFinalDiagnosis().getMedicalHistory());
                casesDetailsDTO.setRadiologistConclusion(cases.getImageOb().getFinalDiagnosis().getRadiologistConclusion());
                casesDetailsDTO.setTreatmentRecommendation(cases.getImageOb().getFinalDiagnosis().getTreatmentRecommendations());
                casesDetailsDTO.setSurgery(cases.getImageOb().getFinalDiagnosis().getSurgery());
            }
            casesDetailsDTO.setPrescriptionURL(cases.getImageOb().getPrescriptionURL());
            casesDetailsDTO.setScannedImageURL(cases.getImageOb().getScannedImageURL());
        }
        return casesDetailsDTO;
    }

    public CasesDetailsDTO insertChatThread(CasesChatDTO casesChatDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesChatDTO.getCaseId());
        Chats chats = cases.getChats();
        Threads threads = new Threads();
        if(chats == null){
            chats = new Chats();
            chats = iChatRepository.save(chats);
            cases.setChats(chats);
            iCasesRepository.save(cases);
        }
        threads.setText(casesChatDTO.getText());
        threads.setUserName(casesChatDTO.getUserName());
        threads.setImageURL(casesChatDTO.getImage());
        threads.setTimeStamp(casesChatDTO.getTimestamp());
        threads.setChats(chats);
        iThreadRepository.save(threads);
        chats.getThreads().add(threads);
        iChatRepository.save(chats);
        cases.setChats(chats);

        Cases cases1 = iCasesRepository.getCaseByCaseId(casesChatDTO.getCaseId());

        CasesDetailsDTO casesDetailsDTO = new CasesDetailsDTO();
        casesDetailsDTO.setCaseId(cases1.getCaseId());
        casesDetailsDTO.setCaseName(cases1.getCaseName());
        casesDetailsDTO.setCaseDate(cases1.getCaseDate());
        casesDetailsDTO.setDoctorName(cases1.getDoctor().getName());
        if(cases1.getRadiologist() != null) {
            casesDetailsDTO.setRadioName(cases1.getRadiologist().getName());
        }else{
            casesDetailsDTO.setRadioName("Not yet assigned");
        }
        if(cases1.getLab() != null) {
            casesDetailsDTO.setLabName(cases1.getLab().getLabName());
        }else{
            casesDetailsDTO.setLabName("Not yet assigned");
        }
        casesDetailsDTO.setPatientName(cases1.getPatient().getFullName());
        casesDetailsDTO.setMarkAsDone(cases1.getMarkAsDone());
        casesDetailsDTO.setCaseDescription(cases1.getCaseDescription());
        List<ThreadsDTO> threadsF = new ArrayList<>();
        for(Threads threads1: cases1.getChats().getThreads()){
            ThreadsDTO threadsDTO = new ThreadsDTO();
            threadsDTO.setText(threads1.getText());
            threadsDTO.setTimeStamp(threads1.getTimeStamp());
            threadsDTO.setImageURL(threads1.getImageURL());
            threadsDTO.setUserName(threads1.getUserName());
            threadsF.add(threadsDTO);
        }
        casesDetailsDTO.setThreads(threadsF);

        if(cases1.getImageOb() != null){
            if(cases1.getImageOb().getFinalDiagnosis() != null){
                casesDetailsDTO.setAge(cases1.getImageOb().getFinalDiagnosis().getAge());
                casesDetailsDTO.setConclusion(cases1.getImageOb().getFinalDiagnosis().getConclusion());
                casesDetailsDTO.setStatus(cases1.getImageOb().getFinalDiagnosis().getStatus());
                casesDetailsDTO.setTherapy(cases1.getImageOb().getFinalDiagnosis().getTherapy());
                casesDetailsDTO.setMedicalHistory(cases1.getImageOb().getFinalDiagnosis().getMedicalHistory());
                casesDetailsDTO.setRadiologistConclusion(cases1.getImageOb().getFinalDiagnosis().getRadiologistConclusion());
                casesDetailsDTO.setTreatmentRecommendation(cases1.getImageOb().getFinalDiagnosis().getTreatmentRecommendations());
                casesDetailsDTO.setSurgery(cases1.getImageOb().getFinalDiagnosis().getSurgery());
            }
            casesDetailsDTO.setPrescriptionURL(cases1.getImageOb().getPrescriptionURL());
            casesDetailsDTO.setScannedImageURL(cases1.getImageOb().getScannedImageURL());
        }
        return casesDetailsDTO;
    }

    public CasesDetailsDTO updateReport(CasesDetailsDTO caseDetailsDTO) {
        Cases cases1 = iCasesRepository.getCaseByCaseId(caseDetailsDTO.getCaseId());

        CasesDetailsDTO casesDetailsDTO = new CasesDetailsDTO();
        casesDetailsDTO.setCaseId(cases1.getCaseId());
        casesDetailsDTO.setCaseName(cases1.getCaseName());
        casesDetailsDTO.setCaseDate(cases1.getCaseDate());
        casesDetailsDTO.setDoctorName(cases1.getDoctor().getName());
        if(cases1.getRadiologist() != null) {
            casesDetailsDTO.setRadioName(cases1.getRadiologist().getName());
        }else{
            casesDetailsDTO.setRadioName("Not yet assigned");
        }
        if(cases1.getLab() != null) {
            casesDetailsDTO.setLabName(cases1.getLab().getLabName());
        }else{
            casesDetailsDTO.setLabName("Not yet assigned");
        }
        casesDetailsDTO.setPatientName(cases1.getPatient().getFullName());
        casesDetailsDTO.setMarkAsDone(cases1.getMarkAsDone());
        casesDetailsDTO.setCaseDescription(cases1.getCaseDescription());
        List<ThreadsDTO> threadsF = new ArrayList<>();
        for(Threads threads1: cases1.getChats().getThreads()){
            ThreadsDTO threadsDTO = new ThreadsDTO();
            threadsDTO.setText(threads1.getText());
            threadsDTO.setTimeStamp(threads1.getTimeStamp());
            threadsDTO.setImageURL(threads1.getImageURL());
            threadsDTO.setUserName(threads1.getUserName());
            threadsF.add(threadsDTO);
        }
        casesDetailsDTO.setThreads(threadsF);

        if(cases1.getImageOb() != null){
            if(cases1.getImageOb().getFinalDiagnosis() != null){
                casesDetailsDTO.setAge(cases1.getImageOb().getFinalDiagnosis().getAge());
                casesDetailsDTO.setConclusion(cases1.getImageOb().getFinalDiagnosis().getConclusion());
                casesDetailsDTO.setStatus(cases1.getImageOb().getFinalDiagnosis().getStatus());
                casesDetailsDTO.setTherapy(cases1.getImageOb().getFinalDiagnosis().getTherapy());
                casesDetailsDTO.setMedicalHistory(cases1.getImageOb().getFinalDiagnosis().getMedicalHistory());
                casesDetailsDTO.setRadiologistConclusion(cases1.getImageOb().getFinalDiagnosis().getRadiologistConclusion());
                casesDetailsDTO.setTreatmentRecommendation(cases1.getImageOb().getFinalDiagnosis().getTreatmentRecommendations());
                casesDetailsDTO.setSurgery(cases1.getImageOb().getFinalDiagnosis().getSurgery());
            }
            casesDetailsDTO.setPrescriptionURL(cases1.getImageOb().getPrescriptionURL());
            casesDetailsDTO.setScannedImageURL(cases1.getImageOb().getScannedImageURL());
        }
        return casesDetailsDTO;
    }
}
