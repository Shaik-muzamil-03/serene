package com.alhaytham.alhaytham.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.alhaytham.alhaytham.domain.user.model.User;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

@Service
public class JwtService {

    private static final long DEFAULT_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

    @Value("${app.secret.key}")
    private String SECRET_KEY;
    
    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET_KEY);
        secretKey = Keys.hmacShaKeyFor(decodedKey);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails, DEFAULT_EXPIRATION_TIME);
    }

    public String generateToken(UserDetails userDetails, long expirationTimeMillis) {
        if (!(userDetails instanceof CustomUserDetails customUserDetails)) {
            throw new IllegalArgumentException("JwtService.generateToken: UserDetails must be instance of CustomUserDetails");
        }

        User user = customUserDetails.getUser();
        Long userId = user.getId();
        String userName = user.getName();

        // Add extra claims. Content of token
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", userId);
        extraClaims.put("userName", userName);

        return Jwts.builder()
            .claims(extraClaims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationTimeMillis))
            .signWith(secretKey, Jwts.SIG.HS256)
            .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
