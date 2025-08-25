package com.alhaytham.alhaytham.domain.user.service;

import com.alhaytham.alhaytham.domain.user.dto.UserUpdateDto;
import com.alhaytham.alhaytham.domain.user.model.User;
import com.alhaytham.alhaytham.domain.user.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return this.userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public List<User> findAll() {
        return this.userRepository.findAll();
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }
    
    public void delete(User user) {
        this.userRepository.delete(user);
    }

    public User updateButNotPassword(Long id, UserUpdateDto dto) {
        return userRepository.findById(id)
            .map(user -> {
                // Update name if valid and changed
                if (dto.getName() != null && !dto.getName().isBlank() && !dto.getName().equals(user.getName())) {
                    user.setName(dto.getName());
                }

                // Update email if it is valid and has changed
                if (dto.getEmail() != null && !dto.getEmail().isBlank() && !dto.getEmail().equals(user.getEmail())) {
                    Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());

                    // If there is another user with that email (and it is not the same one), throw exception
                    if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                        throw new IllegalArgumentException("Email already exists");
                    }

                    user.setEmail(dto.getEmail());
                }

                return userRepository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("UserService.updateUserButNotPassword: User not found"));
    }

    public User updatePassword(Long id, String password) {
        return userRepository.findById(id)
            .map(user -> {
                user.setPassword(passwordEncoder.encode(password));

                return userRepository.save(user);
            })
            .orElseThrow(() -> new RuntimeException("UserService.updatePassword: User not found"));
    }

    public boolean passwordMatches(String currentPassword, String incomingPassword) {
        return passwordEncoder.matches(incomingPassword, currentPassword);
    }
}
