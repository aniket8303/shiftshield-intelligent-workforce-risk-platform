# 🏥 ShiftShield — Intelligent Hospital Workforce Risk & Decision Support Platform

> A full-stack intelligent workforce platform that helps hospitals detect staffing and operational risks, understand their causes, simulate corrective actions, and make auditable workforce decisions.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-green)
![Hibernate](https://img.shields.io/badge/Hibernate-JPA-brown)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-purple)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🚀 Overview

**ShiftShield** is an intelligent hospital workforce and operational risk decision-support platform built using **React, Spring Boot, Spring Security, JPA/Hibernate, and MySQL**.

Unlike a traditional hospital management or CRUD application, ShiftShield focuses on the complete operational decision lifecycle:

```text
Workforce Data
      ↓
Risk Detection
      ↓
Cause Analysis
      ↓
Recommended Action
      ↓
What-If Simulation
      ↓
Management Decision
      ↓
Apply Change
      ↓
Risk Recalculation
      ↓
Notification
      ↓
Audit Trail
````

The platform helps management understand **what is wrong, why it is happening, what could be done, and what the impact of a proposed change would be before modifying live schedules.**

---

# 🎯 Problem

Hospital workforce planning involves multiple operational constraints:

* Staff availability
* Department staffing requirements
* Senior staff coverage
* Staff skills
* Workload
* Working hours
* Consecutive shifts
* Minimum rest periods
* Shift assignments

Traditional CRUD systems can store this information, but they generally do not answer:

> **"What is the operational risk, why does it exist, and what happens if we change the current staffing plan?"**

ShiftShield is designed around this decision-support problem.

---

# ⭐ Key Features

### 👥 Workforce Management

* Staff management
* Department management
* Staff skills
* Staff availability
* Workforce status
* Shift assignments

### 📅 Shift Management

* Shift scheduling
* Department-specific shifts
* Staffing requirements
* Senior staffing requirements
* Assignment management

### 🧠 Risk Intelligence

The Risk Engine evaluates factors such as:

* Staffing shortage
* Senior staff coverage
* Workload
* Weekly working hours
* Consecutive shifts
* Rest periods
* Required skills

Risk levels:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### ⚙️ Configurable Risk Rules

Risk thresholds are configurable instead of being hardcoded.

Example:

```text
Minimum Rest              8 hours
Maximum Consecutive       4 shifts
Maximum Weekly Hours      48 hours
Required Senior Staff     2
Required Staffing         8
High Workload Threshold   75
```

### 🔬 What-If Scenario Simulator

A supervisor can simulate a proposed staffing change **without modifying live data**.

Example:

```text
Current Shift

Required Staff:     8
Assigned Staff:     6

Senior Required:    2
Senior Assigned:    1

Risk Score:         78 HIGH
```

After simulating an eligible staff replacement:

```text
Assigned Staff:
6 → 7

Senior Coverage:
1 → 2

Risk:
78 HIGH → 48 MEDIUM
```

Only after the authorized user applies the scenario is the live assignment changed.

---

# 🔄 Core Decision Workflow

```text
Monitor
   ↓
Detect Risk
   ↓
Understand Cause
   ↓
Recommend Action
   ↓
Simulate Scenario
   ↓
Human Decision
   ↓
Apply Approved Change
   ↓
Recalculate Risk
   ↓
Notify Stakeholders
   ↓
Audit Trail
```

This makes ShiftShield more than a CRUD application by connecting operational data with **risk analysis and decision support**.

---

# 🔐 Security

Implemented using **Spring Security + JWT**.

### Security features

* JWT authentication
* BCrypt password hashing
* Role-Based Access Control
* Backend authorization
* Organization-level data isolation
* Request validation
* Protected administrative APIs
* Audit logging

### Authentication Flow

```text
Login
  ↓
Credential Verification
  ↓
JWT Generation
  ↓
Frontend
  ↓
Authorization Header
  ↓
JWT Filter
  ↓
SecurityContext
  ↓
Authorization
  ↓
Protected API
```

Backend authorization is enforced independently of frontend route visibility.

---

# 🏢 Multi-Tenant Design

ShiftShield supports organization-level data isolation.

```text
Hospital A
 ├── Departments
 ├── Staff
 ├── Shifts
 └── Risk Assessments

Hospital B
 ├── Departments
 ├── Staff
 ├── Shifts
 └── Risk Assessments
```

Backend access rules ensure that one organization cannot access another organization's operational data.

---

# ⚡ Performance Engineering

The application includes performance optimizations across the frontend, backend, and database.

### Frontend

* React route-level code splitting
* Vite vendor chunk splitting
* Reduced duplicate API requests
* Progressive loading
* Skeleton loading states
* Efficient data fetching

### Backend

* JPA `@EntityGraph` for frequently accessed relationships
* DTO-based responses
* Server-side pagination
* Optimized repository queries
* Reduced unnecessary entity loading
* HikariCP connection pool tuning

### Database

* Indexes on frequently queried fields
* Indexed foreign keys
* Efficient filtering and lookup
* Pagination for high-volume datasets

---

# 🚀 Production Startup Optimization

Large synthetic datasets are separated from essential application startup.

### EssentialDataInitializer

Loads lightweight configuration:

```text
Organizations
Departments
Core Demo Users
Risk Rules
```

### DemoDataLoaderService

Handles large demonstration datasets:

```text
Staff
Shifts
Shift Assignments
Audit Logs
```

Demo data can be explicitly imported through a protected admin API:

```http
POST /api/admin/demo-data/import
```

This prevents large CSV processing from blocking application startup.

---

# 🏗️ Architecture

```text
                    Users
                      │
                      ▼
               React + Vite
                      │
                    Axios
                      │
                   REST API
                      │
                      ▼
          ┌────────────────────────┐
          │      Spring Boot       │
          │                        │
          │ Controllers            │
          │ Services               │
          │ Spring Security        │
          │ JWT                    │
          │ Risk Engine            │
          │ Validation             │
          └────────────┬───────────┘
                       │
                  JPA / Hibernate
                       │
                       ▼
                    MySQL
```

### Production Deployment

```text
                   Internet
                      │
                      ▼
              ┌───────────────┐
              │    Vercel     │
              │ React + Vite  │
              └───────┬───────┘
                      │
                     HTTPS
                      │
                      ▼
              ┌───────────────┐
              │    Render     │
              │ Spring Boot   │
              └───────┬───────┘
                      │
                   JDBC / SSL
                      │
                      ▼
              ┌───────────────┐
              │     Aiven     │
              │     MySQL     │
              └───────────────┘
```

---

# 🛠️ Technology Stack

| Layer           | Technologies                                 |
| --------------- | -------------------------------------------- |
| Frontend        | React, Vite, JavaScript, React Router, Axios |
| UI              | CSS, Tailwind CSS, Recharts, Lucide          |
| Backend         | Java 17, Spring Boot, Spring MVC             |
| Security        | Spring Security, JWT, BCrypt                 |
| Persistence     | Spring Data JPA, Hibernate                   |
| Database        | MySQL                                        |
| API             | REST                                         |
| Build           | Maven, Vite                                  |
| Version Control | Git, GitHub                                  |
| Testing/API     | Postman                                      |
| Deployment      | Vercel, Render, Aiven                        |

---

# 👤 Role-Based Command Centers

ShiftShield provides different interfaces according to organizational responsibility.

| Role                   | Main Responsibility                      |
| ---------------------- | ---------------------------------------- |
| CEO                    | Enterprise risk and analytics            |
| COO                    | Operational decisions and actions        |
| HR                     | Workforce and staff management           |
| Nursing Superintendent | Nursing operations                       |
| Department Head        | Department-level workforce operations    |
| Supervisor             | Shift management and scenario simulation |
| Staff                  | Personal shifts, workload and requests   |
| System Admin           | System configuration and governance      |

---

# 📊 Example Use Case

### ICU Night Shift

```text
Required Staff       = 8
Assigned Staff       = 6

Required Senior      = 2
Assigned Senior      = 1

Workload             = HIGH

Risk Score            = 78
Risk Level            = HIGH
```

The supervisor identifies an eligible staff member and runs a simulation.

```text
Before:
Assigned Staff = 6
Senior Staff   = 1
Risk           = 78 HIGH

        ↓ Simulation

After:
Assigned Staff = 7
Senior Staff   = 2
Risk           = 48 MEDIUM
```

The scenario is then reviewed and can be explicitly applied.

```text
Apply Scenario
      ↓
Assignment Updated
      ↓
Risk Recalculated
      ↓
Notification Created
      ↓
Audit Log Created
```

---

# 📁 Project Structure

```text
ShiftShield/
│
├── shiftshield-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/shiftshield/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── dto/
│   │   │   │   ├── security/
│   │   │   │   ├── risk/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       └── data/
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── shiftshield-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── routes/
│   ├── vite.config.js
│   └── package.json
│
├── database/
├── docs/
├── .gitignore
└── README.md
```

---

# 🧪 Testing

The project can be tested at multiple levels.

### Backend

* REST API testing
* Service testing
* Repository testing
* Security testing
* Validation testing
* Risk Engine testing

### Frontend

* Component testing
* Route testing
* API integration testing
* Role-based UI testing

### End-to-End Workflow

```text
Supervisor Login
      ↓
Risk Overview
      ↓
Identify High-Risk Shift
      ↓
Find Eligible Staff
      ↓
Run Simulation
      ↓
Evaluate New Risk
      ↓
Apply Scenario
      ↓
Risk Recalculation
      ↓
Notification
      ↓
Audit Log
      ↓
Staff Updated View
```

---

# 🌐 Deployment

### Frontend

Deployed using **Vercel**.

### Backend

Deployed using **Render**.

### Database

Hosted using **Aiven MySQL**.

### Health Check

```text
GET /actuator/health
```

The backend exposes a lightweight health endpoint for deployment monitoring.

> Note: The Render Free tier can spin down after inactivity, so the first backend request after a period of inactivity may take longer than subsequent requests.

---

# 🎓 What This Project Demonstrates

This project demonstrates practical experience with:

* Java backend development
* Spring Boot
* REST API development
* Spring Security
* JWT authentication
* Role-Based Access Control
* JPA/Hibernate
* MySQL database design
* React frontend development
* API integration
* Configurable business rules
* Risk calculation
* Decision-support systems
* What-if simulation
* Multi-tenant architecture
* Audit logging
* Database optimization
* API performance optimization
* Cloud deployment

---

# 🔮 Future Scope

Potential extensions include:

* Machine-learning-based workforce risk prediction
* Staff absence prediction
* Demand forecasting
* Intelligent shift recommendations
* Optimization-based scheduling
* Real-time hospital integrations
* Redis caching
* Message queues
* Advanced analytics
* Mobile application
* Centralized monitoring and observability

---

# 👨‍💻 Developer

**Aniket Pandurang Parekar**

Final Year B.E. Computer Engineering
P.E.S. Modern College of Engineering, Pune
Savitribai Phule Pune University

### Technologies I worked with

```text
Java • Spring Boot • Spring Security • JWT
React • JavaScript • REST APIs
JPA • Hibernate • MySQL
Git • GitHub • Docker
Vercel • Render • Aiven
```

---

# 📄 Disclaimer

ShiftShield uses synthetic/demo data for development, testing, demonstration, and academic purposes.

It is not intended to replace professional medical, clinical, staffing, compliance, or administrative judgment.

Operational decisions should remain under appropriate human supervision.

---

# 📜 License

This project is licensed under the **MIT License**.

Copyright (c) 2026 Aniket Pandurang Parekar.

---

## ⭐ Project Vision

> **ShiftShield transforms hospital workforce data into explainable, actionable, and auditable operational decisions.**

```

### Why this version is better for recruiters

I deliberately made it **shorter and more outcome-focused** than your previous README. A recruiter can understand within the first few sections:

**What is it? → What problem does it solve? → What makes it different? → How does it work? → What technologies did you use? → Can you actually deploy it?**

I also avoided putting unverified performance numbers such as "`<500ms`" in the README. Since you're actively optimizing the 5–6 second navigation issue, it's better to add measured numbers later under **Performance** once you have actual before/after measurements.

One thing I'd strongly recommend after pasting it: add **3–5 screenshots/GIFs** near the top (Dashboard, Risk Overview, Simulator, and Staff view). For a recruiter, that can communicate the quality of your project much faster than another 500 lines of documentation.
```
