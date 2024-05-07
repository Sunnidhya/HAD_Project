package com.example.had_backend.WebSecConfig;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.had_backend.Patient.Service.PatientService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    @Autowired
    private PatientService patientService;

    private String secretKey= "Abvdfch121322sgdfehxhhb1212";

    @PostConstruct
    protected void init(){
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String login){
        Date now = new Date();
        Date validity = new Date(now.getTime() + 7_200_000);

        return JWT.create()
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("userName",login)
                .sign(Algorithm.HMAC256(secretKey));
    }

    public Authentication validateToken(String token){

        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        UserDTO user = UserDTO.builder()
                .userName(decoded.getClaim("userName").asString())
                .build();

        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());

    }
}
