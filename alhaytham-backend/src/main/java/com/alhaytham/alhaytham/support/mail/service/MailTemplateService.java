package com.alhaytham.alhaytham.support.mail.service;

import org.springframework.stereotype.Service;

@Service
public class MailTemplateService {

    public MailTemplateService() {
    }

    public String buildWelcomeEmail(String username) {
        return "Hello " + username + ",\n\nWelcome! We hope you enjoy the experience.";
    }

    public String buildPasswordResetEmail(String resetLink) {
        return "You have requested to reset your password.\n\n"
            + "Click on the following link to continue:\n" + resetLink + "\n\n"
            + "This link will expire in 15 minutes.";
    }
}
