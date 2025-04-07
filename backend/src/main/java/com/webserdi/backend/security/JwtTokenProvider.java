package com.webserdi.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {
    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app-jwt-expiration-milliseconds}")
    private long jwtExpirationMs; // Fixed type to long

    private Set<String> blacklistedTokens = new HashSet<>();

    private Key key() {
        // Para un `jwtSecret` que esta en Base64-encoded:
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));

        // O se utiliza este cuando `jwtSecret` es texto plano:
        // return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles) // Incluir roles en el payload
                .setIssuer("your-issuer") // Buenas prácticas: incluir issuer
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(jwtExpirationMs)))
                .signWith(key(), SignatureAlgorithm.HS512) // Algoritmo más seguro
                .compact();
    }

    // Get username from Jwt token
    public String getUsername(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Validate Jwt token
    public boolean validateToken(String token){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(key())
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

    public void invalidateToken(String token) {
        blacklistedTokens.add(token);
    }
}