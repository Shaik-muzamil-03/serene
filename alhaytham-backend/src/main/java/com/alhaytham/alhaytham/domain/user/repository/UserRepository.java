package com.alhaytham.alhaytham.domain.user.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.alhaytham.alhaytham.domain.user.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
