package com.example.had_backend.Global.Controller;

import com.example.had_backend.Doctor.Entity.Doctor;
import com.example.had_backend.Email.EmailService;
import com.example.had_backend.Global.Model.OtpDTO;
import com.example.had_backend.Global.Service.GlobalService;
import com.example.had_backend.Model.CountDTO;
import com.example.had_backend.Model.LoginMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class GlobalController {

        @Autowired
        private GlobalService globalService;

        @Autowired
        private EmailService emailService;

        @CrossOrigin
        @GetMapping ("/count")
        public ResponseEntity<CountDTO> getCount() {
                CountDTO countDTO = new CountDTO();

                // Retrieve counts from the service layer
                countDTO.setCountDoctors(globalService.getCountDoctors());
                countDTO.setCountRadiologist(globalService.getCountRadiologist());
                countDTO.setCountLab(globalService.getCountLab());
                countDTO.setCountPatient(globalService.getCountPatient());

                return ResponseEntity.ok(countDTO);
        }
}
