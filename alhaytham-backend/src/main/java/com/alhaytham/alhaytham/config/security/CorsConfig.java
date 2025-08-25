package com.alhaytham.alhaytham.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Value("${app.frontend.url}")
    private String FRONTEND_URL;
    private static final String[] ALLOWED_HTTP_METHODS = {"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"};

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all endpoints
                        .allowedOrigins(FRONTEND_URL)
                        .allowedMethods(ALLOWED_HTTP_METHODS)
                        .allowCredentials(true);
            }
        };
    }
}