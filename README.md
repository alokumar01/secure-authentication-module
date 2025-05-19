# Secure Authentication Module

This is our academic college project focused on building a **secure secondary authentication system** for Linux. The system prompts users with an additional login or registration page **immediately after they unlock or boot into their Linux machine**, adding an extra layer of security.

<p align="center">
  <a href="https://github.com/alokumar01" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/alokumar01/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</p>

---

## 🔐 Objective

To enhance system security by forcing an additional authentication step right after the user logs into Linux using their default method (e.g., password, fingerprint, or face recognition).

---

## 🚀 Features

- Runs **automatically in the background** after Linux login
- Custom login/register web page for secondary user verification
- Access to desktop or system functionality is **restricted until re-authentication**
- Works alongside existing Linux login systems (e.g., PAM, biometrics)

---

## 🛠️ Tech Stack

- **MongoDB** – Database for storing user credentials and session data  
- **Express.js** – Backend server handling authentication logic  
- **Node.js** – Runtime environment for server-side logic  
- **Next.js** – Frontend framework for rendering the login/register UI  
- **Python** – Used for system-level scripting and automation  
- **Linux (Ubuntu preferred)** – Target operating system  
- **PAM (Pluggable Authentication Modules)** – Optional integration for advanced user verification

---
