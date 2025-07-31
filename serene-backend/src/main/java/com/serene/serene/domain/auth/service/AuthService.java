package com.serene.serene.domain.auth.service;

import com.serene.serene.config.security.CustomUserDetails;
import com.serene.serene.config.security.CustomUserDetailsService;
import com.serene.serene.config.security.JwtService;
import com.serene.serene.domain.user.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService, CustomUserDetailsService customUserDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.customUserDetailsService = customUserDetailsService;
    }

    public Authentication authenticate(String email, String unencryptedPassword) {
        return this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, unencryptedPassword));
    }

    public UserDetails loadUserByEmail(String email) {
        return this.customUserDetailsService.loadUserByUsername(email);
    }

    public User getUserFromUserDetails(UserDetails userDetails) {
        if (userDetails instanceof CustomUserDetails customDetails) {
            return customDetails.getUser();
        }

        throw new IllegalArgumentException("AuthService.getUserFromUserDetails: UserDetails is not an instance of CustomUserDetails");
    }

    public String getToken(UserDetails userDetails) {
        return jwtService.generateToken(userDetails);
    }

    public String getToken(UserDetails userDetails, long expirationMillis) {
        return jwtService.generateToken(userDetails, expirationMillis);
    }

    public String fullAuthentication(String email, String unencryptedPassword) {
        // Authenticate the user
        this.authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, unencryptedPassword));

        // Load user credentials
        UserDetails userDetails = this.loadUserByEmail(email);

        // Get token
        return getToken(userDetails);
    }

    public String extractUsername(String token) {
        //Subject
        return jwtService.extractUsername(token);
    }
}
