package com.serene.serene.support.mail.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    
    private final JavaMailSender javaMailSender;
    
    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("alhaytham.stores@gmail.com"); // Default dummy email for testing. Replace this email for production
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        this.javaMailSender.send(message);
    }
}