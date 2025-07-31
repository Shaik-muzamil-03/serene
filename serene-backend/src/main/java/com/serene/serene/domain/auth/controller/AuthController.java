package com.serene.serene.domain.auth.controller;

import com.serene.serene.config.security.CustomUserDetails;
import com.serene.serene.domain.user.dto.UserLoginDto;
import com.serene.serene.domain.user.dto.UserRegistrationDto;
import com.serene.serene.domain.auth.service.AuthService;
import com.serene.serene.domain.user.model.User;
import com.serene.serene.domain.user.service.UserService;
import com.serene.serene.support.mail.service.MailService;
import com.serene.serene.support.mail.service.MailTemplateService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthService authService;
    private final MailService mailService;
    
    @Value("${app.frontend.url}")
    private String FRONTEND_URL;

    public AuthController(PasswordEncoder passwordEncoder, UserService userService, AuthService authService, MailService mailService) {
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.authService = authService;
        this.mailService = mailService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto, HttpServletResponse httpServletResponse) {
        try {
            // Authenticate User and generate JWT
            String token = this.authService.fullAuthentication(userLoginDto.getEmail(), userLoginDto.getPassword());

            ResponseCookie responseCookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(2))
                .build();

            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

            return ResponseEntity.ok().build();
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("An authentication error has occurred: " + ex.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto userRegistrationDto, HttpServletResponse httpServletResponse) {
        String name = userRegistrationDto.getName();
        String email = userRegistrationDto.getEmail();
        String password = userRegistrationDto.getPassword();

        // Check if the user exists before to continue
        Optional<User> existingUser = this.userService.findByEmail(email);

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: there is already a registered user with this email address: " + email);
        }

        try {
            // Create the new user
            User newUser = new User(name, email, passwordEncoder.encode(password));

            // Save new user
            this.userService.save(newUser);

        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Validation failed: " + ex.getMessage());
        }

        try {
            // Authenticate User and generate JWT
            String token = this.authService.fullAuthentication(email, password);

            ResponseCookie responseCookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofHours(2))
                .build();

            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

            return ResponseEntity.ok().build();
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Authentication error: " + ex.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse httpServletResponse) {
        ResponseCookie responseCookie = ResponseCookie.from("token", "")
            .httpOnly(true)
            .secure(false)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();

        httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-details")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        if (customUserDetails == null) {
            return ResponseEntity.ok().body(Map.of("loggedIn", false));
        }

        User user = customUserDetails.getUser();

        return ResponseEntity.ok().body(Map.of(
            "loggedIn", true,
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail()
        ));
    }

    @PostMapping("/recover-password")
    public ResponseEntity<?> recoverPassword(@RequestParam String email) {
        // Check if the user exists before to continue
        Optional<User> existingUser = this.userService.findByEmail(email);

        if (!existingUser.isPresent()) {
            return ResponseEntity.ok().build();
        }

        User user = existingUser.get();
        long fifteenMinutesExpTime = 1000 * 60 * 15; // 15 minutes

        String token = this.authService.getToken(new CustomUserDetails(user), fifteenMinutesExpTime);
        String resetLink = FRONTEND_URL + "/reset-password?token=" + token;

        MailTemplateService mailTemplateService = new MailTemplateService();

        // Send email
        String subject = "Password recovery";
        String body = mailTemplateService.buildPasswordResetEmail(resetLink);
        this.mailService.send(user.getEmail(), subject, body);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        String userEmail;

        try {
            userEmail = authService.extractUsername(token);
        } catch (ExpiredJwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("The token has expired: " + ex.getMessage());
        } catch (JwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + ex.getMessage());
        }

        Optional<User> userOpt = this.userService.findByEmail(userEmail);

        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        this.userService.save(user);

        return ResponseEntity.ok().build();
    }
}
