package com.example.had_backend.OTP;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
//@RequestMapping("/api/v1/otp/")
public class OneTimePasswordController {
    private OneTimePasswordService oneTimePAsswordService;

    @Autowired
    public OneTimePasswordController(OneTimePasswordService oneTimePAsswordService) {
        this.oneTimePAsswordService = oneTimePAsswordService;
    }
    @CrossOrigin
    @GetMapping("/api/v1/otp/create")
    public Object getOneTimePassword() {
        System.out.println("here");
        try {
            return ResponseEntity.ok(oneTimePAsswordService.returnOneTimePassword());
        } catch (Exception exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }
    }
}