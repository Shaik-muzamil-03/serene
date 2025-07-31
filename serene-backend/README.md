# Serene Backend (Springboot)

This is the backend for **Serene** — a lightweight, modern StarterKit built with **Spring Boot 3** and **Java 21+**.  
Inspired by Laravel Breeze, Serene provides a clean, secure, and extensible authentication system using **JWT**, **HttpOnly cookies**, and a modular layered architecture — ready to scale with your application.

---

## ✨ Features

- JWT authentication (Login, Register, Token Validation)
- HttpOnly cookie support for secure authentication
- Logout endpoint with cookie clearing
- Password confirmation before sensitive actions (e.g., account deletion)
- Password recovery via email (using Mailpit + Spring Mail)
- Layered architecture (Controllers, Services, Repositories, DTOs)
- Secure password hashing with BCrypt
- Modular structure for domain logic
- Docker-ready for local development

---

## 🧰 Tech Stack

- Java 21+
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT (`jjwt`)
- MySQL / PostgreSQL (configurable)
- Maven
- Docker (MySQL + Mailpit)
- Spring Mail

---

> **💡 Tip:** When using this project, consider renaming references to `serene` with your app name or organization domain.

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/serene.git
cd serene/backend
```

### 2. Start Docker services (MySQL + Mailpit)

```bash
docker compose up -d
```

This will launch:

* A MySQL container (with preconfigured credentials)
* Mailpit (email testing UI at http://localhost:8025)

### 3. Run the Spring Boot application

```bash
./mvnw spring-boot:run
```
Alternatively, run it via your favorite IDE (Netbeans, Eclipse, VS Code, etc.)

## 🗄️ Database & App Configuration

Update your `application.properties` with the following example settings:

```properties
spring.application.name=serene

# Frontend origin
app.frontend.url=http://localhost:4200

# JWT secret key
app.secret.key=yLk5VPaPjWw2nVvshOItpXcU1gL5b3P1FpFSadfvOLM=

# MySQL connection
spring.datasource.url=jdbc:mysql://mysql:3306/serene
spring.datasource.username=serene_user
spring.datasource.password=secret
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# SMTP - Mailpit setup
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=false
spring.mail.properties.mail.smtp.starttls.enable=false
```

📦 Main Dependencies (pom.xml)

* `spring-boot-starter-web`
* `spring-boot-starter-security`
* `spring-boot-starter-data-jpa`
* `spring-boot-starter-mail`
* `jjwt-api, jjwt-impl, jjwt-jackson`
* `mysql-connector-j`
* `spring-boot-docker-compose`

✉️ Email Testing with Mailpit

No SMTP credentials required. Serene uses Mailpit for local email testing.

* Web UI: http://localhost:8025
* SMTP Port: 1025

Any emails sent via spring.mail.* config will appear in the Mailpit inbox.

## ❤️ Support
If Serene has saved you time or helped you build more efficiently, consider supporting the project by:

* Giving a ⭐️ on GitHub
* Sharing it with other developers
* Making a small donation

Thank you!