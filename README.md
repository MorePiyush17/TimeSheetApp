# ⏱️ Timesheet Management Application

This repository contains the source code for a **full-stack timesheet management system**, built with a **secure ASP.NET Core backend** and a **clean, responsive vanilla JavaScript frontend**.

---

## 🚀 Key Features

- **🔐 Secure User Management** – Employee registration and JWT-based authentication.  
- **📝 Full CRUD Operations** – Authenticated users can create, read, update, and delete their own timesheet entries.  
- **🛡️ Protected API** – Role-based access control ensures users can only access their own data.  
- **🏗️ Clean Architecture** – Layered design for separation of concerns and maintainability.  
- **🗄️ Database First Approach** – Schema managed and versioned with EF Core migrations.  

---

## 🛠️ Tech Stack & Architecture

### Backend
- **Framework:** ASP.NET Core 8  
- **Data Access:** Entity Framework Core 8  
- **Database:** SQL Server  
- **Architecture:**
  - Layered Architecture (Controllers → Services → Repositories)  
  - Repository Pattern  
  - Dependency Injection  
- **API Design:** RESTful, with DTOs for a clear API contract  

### Frontend
- **JavaScript (ES6+)**  
- **Bootstrap 5** for responsive styling  
- **HTML5**  

---

## ⚡ Getting Started

### Backend Setup
1. Open `Timesheet_Application_Backend.sln` in **Visual Studio**.  
2. Update the `DefaultConnection` string in `appsettings.Development.json` to point to your **SQL Server instance**.  
3. Run the following in **Package Manager Console** to apply migrations:  
   ```powershell
   Update-Database

### Frontend Setup

1. Open the Timesheet_Application_Frontend folder in your code editor.

2. In script.js, update the apiBaseUrl variable to match your running backend’s URL.

3. Open index.html in a browser.
