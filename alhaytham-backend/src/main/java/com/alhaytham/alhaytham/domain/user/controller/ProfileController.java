package com.alhaytham.alhaytham.domain.user.controller;

import com.alhaytham.alhaytham.config.security.CustomUserDetails;
import com.alhaytham.alhaytham.domain.auth.service.AuthService;
import com.alhaytham.alhaytham.domain.user.dto.UserPasswordDto;
import com.alhaytham.alhaytham.domain.user.dto.UserUpdateDto;
import com.alhaytham.alhaytham.domain.user.model.User;
import com.alhaytham.alhaytham.domain.user.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/profile")
public class ProfileController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final AuthService authService;

    public ProfileController(UserService userService, PasswordEncoder passwordEncoder, AuthService authService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> edit(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        try {
            User user = customUserDetails.getUser();

            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Error: The user is not authenticated " + e.getMessage());
        }
    }

    @PatchMapping
    public ResponseEntity<?> update(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody UserUpdateDto userUpdateDto, HttpServletResponse response) {
        try {
            User user = customUserDetails.getUser();
            boolean emailChanged = !user.getEmail().equals(userUpdateDto.getEmail());

            User updatedUser = this.userService.updateButNotPassword(user.getId(), userUpdateDto);

            if (emailChanged) {
                String newToken = this.authService.getToken(new CustomUserDetails(updatedUser));
                ResponseCookie responseCookie = ResponseCookie.from("token", newToken)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(Duration.ofHours(2))
                    .build();
                response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
            }

            Map<String, Object> resultUser = new HashMap<>();
            resultUser.put("id", updatedUser.getId());
            resultUser.put("name", updatedUser.getName());
            resultUser.put("email", updatedUser.getEmail());

            return ResponseEntity.ok().body(resultUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(409).body("Error: " + e.getMessage());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Error: User not authenticated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error");
        }
    }

    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody UserPasswordDto userChangePasswordDto) {

        User user = customUserDetails.getUser();

        if (!this.passwordEncoder.matches(userChangePasswordDto.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Invalid current password");
        }

        this.userService.updatePassword(user.getId(), userChangePasswordDto.getNewPassword());

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> delete(@AuthenticationPrincipal CustomUserDetails customUserDetails, HttpServletResponse httpServletResponse) {
        try {
            User user = customUserDetails.getUser();
            this.userService.delete(user);

            // Invalidate the JWT by deleting the cookie
            ResponseCookie responseCookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

            httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/confirm-password")
    public ResponseEntity<Map<String, Object>> confirmPassword(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody UserPasswordDto userPasswordDto) {
        User user = customUserDetails.getUser();

        boolean isValid = userService.passwordMatches(user.getPassword(), userPasswordDto.getCurrentPassword());
        if (isValid) {
            return ResponseEntity.ok(Map.of("validPassword", true));
        } else {
            return ResponseEntity.ok(Map.of("validPassword", false));
        }
    }
}
