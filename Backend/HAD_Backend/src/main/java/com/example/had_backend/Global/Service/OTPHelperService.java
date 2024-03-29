package com.example.had_backend.Global.Service;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OTPHelperService {
    private final static Integer LENGTH = 6;

    public String createRandomOneTimePassword() {
        Random random = new Random();
        StringBuilder oneTimePassword = new StringBuilder();
        for (int i = 0; i < LENGTH; i++) {
            int randomNumber = random.nextInt(10);
            oneTimePassword.append(randomNumber);
        }
        return oneTimePassword.toString().trim();
    }
}
