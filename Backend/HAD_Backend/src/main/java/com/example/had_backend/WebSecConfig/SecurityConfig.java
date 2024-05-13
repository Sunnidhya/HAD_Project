package com.example.had_backend.WebSecConfig;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
    private final UserAuthProvider userAuthProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http
                .exceptionHandling(customizer -> customizer.authenticationEntryPoint(userAuthenticationEntryPoint))
                .addFilterBefore(new JWTAuthFilter(userAuthProvider), BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((requests) -> requests
                .requestMatchers(HttpMethod.POST,
                        "/admin/login",
                        "/doctor/login",
                        "/patient/login",
                        "/doctor/register",
                        "/radiologist/login",
                        "/radiologist/register",
                        "/patient/register",
                        "/lab/register",
                        "/lab/login",
                        "/doctor/remove",
                        "/patient/remove",
                        "/radiologist/remove",
                        "/lab/remove",
                        "/doctor/login/validateOTP",
                        "/lab/login/validateOTP",
                        "/patient/login/validateOTP",
                        "/radiologist/login/validateOTP").permitAll()
                .anyRequest().authenticated());
        return http.build();
    }
}