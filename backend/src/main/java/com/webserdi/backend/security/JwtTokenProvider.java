package com.webserdi.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app-jwt-expiration-milliseconds}")
    private long jwtExpirationDate;

    private Key key;

    @PostConstruct
    public void init() {
        key=Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }


    // Generate JWT token
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        Date currentDate = new Date();

        Date expireDate = new Date(currentDate.getTime() + jwtExpirationDate);

        Claims claims = Jwts.claims().setSubject(username);

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
        return token;
    }


    // Get username from Jwt token
    public String getUsername(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        String username = claims.getSubject();
        return username;
    }

    // Validate Jwt token
    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parse(token);
            return true;
        } catch (MalformedJwtException ex) {
            //logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            //logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            //logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            //logger.error("JWT claims string is empty.");
        } catch (SignatureException ex){
            //logger.error("JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted.");
        }
        return false;
    }

}