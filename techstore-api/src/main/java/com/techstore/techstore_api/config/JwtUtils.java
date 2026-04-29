package com.techstore.techstore_api.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${techstore.app.jwtSecret}")
    private String jwtSecret;

    @Value("${techstore.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    // Générer un Token à partir de l'email de l'utilisateur
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

   public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key()) // <-- Correction ici : setSigningKey au lieu de setKey
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(key()) // <-- Correction ici : setSigningKey au lieu de setKey
                .build()
                .parseClaimsJws(authToken); // parseClaimsJws est plus précis pour les tokens signés
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}