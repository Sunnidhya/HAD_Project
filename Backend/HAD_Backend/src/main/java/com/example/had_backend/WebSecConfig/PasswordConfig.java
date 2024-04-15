package com.example.had_backend.WebSecConfig;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordConfig  implements PasswordEncoder{

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public PasswordConfig(){
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public String encode(CharSequence rawPassword) {
        // Use a fixed salt value
        String salt = "$2a$10$123456789012345678901.";
        return bCryptPasswordEncoder.encode(rawPassword.toString() + salt);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        // Delegate to the BCryptPasswordEncoder for matching
        return bCryptPasswordEncoder.matches(rawPassword.toString() + "$2a$10$123456789012345678901.", encodedPassword);
    }
}
