package com.example.had_backend.Doctor.Service;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Doctor.Model.DoctorChangePasswordDTO;
import com.example.had_backend.Doctor.Model.DoctorRegistrationDTO;
import com.example.had_backend.Doctor.Model.SearchResultDTO;
import com.example.had_backend.Doctor.Repository.IDoctorRegistrationRepository;
import com.example.had_backend.Global.Entity.*;
import com.example.had_backend.Global.Model.*;
import com.example.had_backend.Global.Repository.*;
import com.example.had_backend.Global.Service.OTPHelperService;
import com.example.had_backend.Model.LoginDTO;
import com.example.had_backend.Model.LoginMessage;
import com.example.had_backend.Radiologist.Entity.Radiologist;
import com.example.had_backend.Radiologist.Repository.IRadiologistRegistrationRepository;
import com.example.had_backend.WebSecConfig.PasswordConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

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

    @Autowired
    private IConsentRepository iConsentRepository;

    private PasswordConfig passwordConfig = new PasswordConfig();
    @Autowired
    private IRadiologistRegistrationRepository iRadiologistRegistrationRepository;

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
        String hashedP = passwordConfig.encode(doctorRegistrationDTO.getPassword());
        doctor.setPassword(hashedP);
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

    public Radiologist getRadioById(Integer radioId) {
        return iRadiologistRegistrationRepository.getByRadiologistId(radioId);
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
            Users users1 = iUsersRepository.findByUserNameAndPassword(login.getUserName());
            Boolean flag = passwordConfig.matches(login.getPassword(), users1.getPassword());
            if(flag){
                return users1;
            }else{
                return null;
            }
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
//        if(cases.getRadiologist() != null) {
//            casesDetailsDTO.setRadioName(cases.getRadiologist().getName());
//        }else{
//            casesDetailsDTO.setRadioName("Not yet assigned");
//        }
        Set<Radiologist> radiologists = cases.getRadiologist();
        if (radiologists != null && !radiologists.isEmpty()) {
            StringBuilder radiologistNames = new StringBuilder();
            for (Radiologist radiologist : radiologists) {
                radiologistNames.append(radiologist.getName()).append(", ");
            }
            radiologistNames.delete(radiologistNames.length() - 2, radiologistNames.length()); // Remove the last comma and space
            casesDetailsDTO.setRadioName(radiologistNames.toString());
        } else {
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
//        List<ChatsDTO> threadsF = new ArrayList<>();
//        if(cases.getChats() != null){
//            for(Threads threads: cases.getChats().getThreads()){
//                ChatsDTO chatsDTO = new ChatsDTO();
//                chatsDTO.setText(threads.getText());
//                chatsDTO.setTimeStamp(threads.getTimeStamp());
//                chatsDTO.setImageURL(threads.getImageURL());
//                chatsDTO.setUserName(threads.getUserName());
//                threadsF.add(chatsDTO);
//            }
//        }
//        casesDetailsDTO.setThreads(threadsF);

        List<ChatsDTO> chatsDTOF = new ArrayList<>();
        for(Chats chats1: cases.getChats()){
            ChatsDTO chatsDTO = new ChatsDTO();
            chatsDTO.setRadioId(chats1.getRadioId());
            chatsDTO.setRadioName(chats1.getRadioName());
            chatsDTO.setRadioImpression(chats1.getRadioImpression());
            List<ThreadsDTO> threadsF = new ArrayList<>();
            for(Threads threads1: chats1.getThreads()){
                ThreadsDTO threadsDTO = new ThreadsDTO();
                threadsDTO.setText(threads1.getText());
                threadsDTO.setTimeStamp(threads1.getTimeStamp());
                threadsDTO.setImageURL(threads1.getImageURL());
                threadsDTO.setUserName(threads1.getUserName());
                threadsF.add(threadsDTO);
            }
            chatsDTO.setThreadsDTO(threadsF);
            chatsDTOF.add(chatsDTO);
        }
        casesDetailsDTO.setThreads(chatsDTOF);

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
        Radiologist radiologist1 = iRadiologistRegistrationRepository.getByRadiologistId(casesChatDTO.getRadioId());
        List<Chats> chats = cases.getChats() != null ? cases.getChats() : new ArrayList<>();
        Threads threads = new Threads();
        Chats chat = new Chats();
        if(chats.isEmpty()){
            chat.setRadioId(casesChatDTO.getRadioId());
            chat.setRadioName(radiologist1.getName());
            iChatRepository.save(chat);
            chats.add(chat);
            cases.setChats(chats);
            iCasesRepository.save(cases);
        }else{
            Chats foundChat = null;
            for(Chats chatV: chats){
                if(chatV.getRadioId().equals(casesChatDTO.getRadioId())){
                    foundChat = chatV;
                }
            }
            if(foundChat == null){
                chat.setRadioId(casesChatDTO.getRadioId());
                chat.setRadioName(radiologist1.getName());
                iChatRepository.save(chat);
                chats.add(chat);
                cases.setChats(chats);
                iCasesRepository.save(cases);
            }else{
                chat = foundChat;
            }
        }
        threads.setText(casesChatDTO.getText());
        threads.setUserName(casesChatDTO.getUserName());
        threads.setImageURL(casesChatDTO.getImage());
        threads.setTimeStamp(casesChatDTO.getTimestamp());
        threads.setChats(chat);
        iThreadRepository.save(threads);
        chat.getThreads().add(threads);
        iChatRepository.save(chat);
        cases.setChats(chats);

        Cases cases1 = iCasesRepository.getCaseByCaseId(casesChatDTO.getCaseId());

        CasesDetailsDTO casesDetailsDTO = new CasesDetailsDTO();
        casesDetailsDTO.setCaseId(cases1.getCaseId());
        casesDetailsDTO.setCaseName(cases1.getCaseName());
        casesDetailsDTO.setCaseDate(cases1.getCaseDate());
        casesDetailsDTO.setDoctorName(cases1.getDoctor().getName());
//        if(cases1.getRadiologist() != null) {
//            casesDetailsDTO.setRadioName(cases1.getRadiologist().getName());
//        }else{
//            casesDetailsDTO.setRadioName("Not yet assigned");
//        }
        Set<Radiologist> radiologists = cases.getRadiologist();
        if (radiologists != null && !radiologists.isEmpty()) {
            StringBuilder radiologistNames = new StringBuilder();
            for (Radiologist radiologist : radiologists) {
                radiologistNames.append(radiologist.getName()).append(", ");
            }
            radiologistNames.delete(radiologistNames.length() - 2, radiologistNames.length()); // Remove the last comma and space
            casesDetailsDTO.setRadioName(radiologistNames.toString());
        } else {
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
        List<ChatsDTO> chatsDTOF = new ArrayList<>();
        for(Chats chats1: cases1.getChats()){
            ChatsDTO chatsDTO = new ChatsDTO();
            chatsDTO.setRadioId(chats1.getRadioId());
            chatsDTO.setRadioName(chats1.getRadioName());
            chatsDTO.setRadioImpression(chats1.getRadioImpression());
            List<ThreadsDTO> threadsF = new ArrayList<>();
            for(Threads threads1: chats1.getThreads()){
                ThreadsDTO threadsDTO = new ThreadsDTO();
                threadsDTO.setText(threads1.getText());
                threadsDTO.setTimeStamp(threads1.getTimeStamp());
                threadsDTO.setImageURL(threads1.getImageURL());
                threadsDTO.setUserName(threads1.getUserName());
                threadsF.add(threadsDTO);
            }
            chatsDTO.setThreadsDTO(threadsF);
            chatsDTOF.add(chatsDTO);
        }
        casesDetailsDTO.setThreads(chatsDTOF);

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

    public LoginMessage assignNewRadio(CasesDTO casesDTO) {
        Cases cases = iCasesRepository.getCaseByCaseId(casesDTO.getCaseId());
        Radiologist radiologist = iRadiologistRegistrationRepository.getByRadiologistId(casesDTO.getRadiologistId());
//        Set<Radiologist> radiologists = cases.getRadiologist();
//        radiologists.add(radiologist);
//        cases.setRadiologist(radiologists);
        if (cases.getConsent() != null) {
            Consent consent = cases.getConsent();
            RadioDTO radioDTO = new RadioDTO();
            radioDTO.setRadioId(casesDTO.getRadiologistId());
            radioDTO.setRadioName(radiologist.getName());
            List<RadioDTO> radioDTOS;
            if (consent.getRadioDTOS() != null) {
                radioDTOS = consent.getRadioDTOS();
            } else {
                radioDTOS = new ArrayList<>();
            }
            radioDTOS.add(radioDTO);
            consent.setRadioDTOS(radioDTOS);
            iConsentRepository.save(consent);
            cases.setConsent(consent);
        } else {
            Consent consent = new Consent();
            RadioDTO radioDTO = new RadioDTO();
            radioDTO.setRadioId(casesDTO.getRadiologistId());
            radioDTO.setRadioName(radiologist.getName());
            List<RadioDTO> radioDTOS = new ArrayList<>();
            radioDTOS.add(radioDTO);
            consent.setRadioDTOS(radioDTOS);
            iConsentRepository.save(consent);
            cases.setConsent(consent);
        }
//        Chats chats = new Chats();
//        chats.setRadioId(radiologist.getUserId());
//        chats.setRadioName(radiologist.getName());
//        chats.setCases(cases);
//        iChatRepository.save(chats);
//        if(cases.getChats().isEmpty()){
//            List<Chats> chats1 = new ArrayList<>();
//            chats1.add(chats);
//            cases.setChats(chats1);
//        }else{
//            cases.getChats().add(chats);
//        }
        iCasesRepository.save(cases);
//        radiologist.getCases().add(cases);
//        iRadiologistRegistrationRepository.save(radiologist);
        LoginMessage loginMessage = new LoginMessage();
        loginMessage.setMessage("Radiologist Assigned Successfully");
        return loginMessage;
    }


    public CasesDetailsDTO updateReport(CasesDetailsDTO caseDetailsDTO) {
        Cases cases1 = iCasesRepository.getCaseByCaseId(caseDetailsDTO.getCaseId());
        FinalDiagnosis finalDiagnosis = new FinalDiagnosis();
        finalDiagnosis.setAge(caseDetailsDTO.getAge());
        finalDiagnosis.setName(caseDetailsDTO.getPatientName());
        finalDiagnosis.setConclusion(caseDetailsDTO.getConclusion());
        finalDiagnosis.setSurgery(caseDetailsDTO.getSurgery());
        finalDiagnosis.setMedicalHistory(caseDetailsDTO.getMedicalHistory());
        finalDiagnosis.setTreatmentRecommendations(caseDetailsDTO.getTreatmentRecommendation());
        finalDiagnosis.setTherapy(caseDetailsDTO.getTherapy());

        cases1.getImageOb().setFinalDiagnosis(finalDiagnosis);
        iCasesRepository.save(cases1);
        CasesDTO casesDTO = new CasesDTO();
        casesDTO.setCaseId(caseDetailsDTO.getCaseId());
        return getCaseByCaseId(casesDTO);
    }
}
