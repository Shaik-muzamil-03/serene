# Serene Frontend (Angular)

This is the **frontend** of the Serene StarterKit — a modern and minimalist setup built with **Angular 20** and **Tailwind CSS**.  
It is designed to integrate seamlessly with the Serene backend (Spring Boot) using **JWT tokens stored in HttpOnly cookies** for secure authentication.

Inspired by the simplicity of Laravel Breeze, this project provides a solid foundation for building secure, fast, and clean web apps from day one.

---

## ✨ Features

- Login, registration, and password recovery forms
- JWT-based authentication with HttpOnly cookies (XSS-safe)
- Modular architecture (`auth`, `core`, `shared`, `services`)
- Built with standalone components (Angular 20+)
- Tailwind CSS for fast and responsive UI styling
- Reactive Forms with validation
- RxJS for reactive HTTP and state handling
- Angular Router with route guards
- Token parsing using `jwt-decode`
- Preconfigured interceptors for authenticated API communication

---

## ⚙️ Prerequisites

- Node.js 20+
- Angular CLI 20+

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
ng serve
```

Access the app at http://localhost:4200

### 3. Build the project

```bash
ng build
```

## ❤️ Support
If Serene has saved you time or helped you build more efficiently, consider supporting the project by:

* Giving a ⭐️ on GitHub
* Sharing it with other developers
* Making a small donation

Thank you!


## 📄 License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

