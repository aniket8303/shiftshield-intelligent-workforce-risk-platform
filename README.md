# ShiftShield — Intelligent Hospital Workforce Risk & Decision Support Platform

> An intelligent hospital workforce and operational risk intelligence platform that transforms staffing, scheduling, workload, and operational data into actionable risk insights and decision support.

![Java](https://img.shields.io/badge/Java-17+-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-green)
![Hibernate](https://img.shields.io/badge/Hibernate-JPA-brown)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📌 Overview

**ShiftShield** is an intelligent hospital workforce and operational risk intelligence platform designed to help hospitals monitor staffing conditions, identify workforce risks, understand their causes, evaluate corrective actions, and make informed operational decisions.

Unlike a traditional CRUD-based staff or hospital management system, ShiftShield focuses on the complete operational decision lifecycle:

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
Management Decision
   ↓
Apply Change
   ↓
Recalculate Risk
   ↓
Notify Stakeholders
   ↓
Audit Trail
```

The goal of ShiftShield is to transform workforce data into actionable, explainable, and auditable operational intelligence.

---

# 🎯 Problem Statement

Hospitals operate with complex workforce constraints involving:

- Staff availability
- Department requirements
- Shift schedules
- Staff skills
- Senior staff coverage
- Workload
- Working hours
- Consecutive shifts
- Minimum rest periods
- Staffing requirements
- Emergency workforce conditions

Traditional management applications mainly provide CRUD functionality:

```text
Create → Read → Update → Delete
```

However, CRUD alone does not answer important operational questions such as:

- Is the current shift adequately staffed?
- Is senior staff coverage sufficient?
- Is the workload too high?
- Are employees approaching working-hour limits?
- Is a staff member eligible for a particular shift?
- What is causing the current operational risk?
- What happens if another employee is assigned?
- Will the proposed change reduce the risk?
- Who approved the operational change?
- What changed after the decision?

ShiftShield addresses these problems through an operational risk intelligence and decision-support workflow.

---

# 🚀 Core Features

## 1. Workforce Management

Manage:

- Hospital organizations
- Departments
- Staff
- Staff roles
- Staff skills
- Staff availability
- Workforce status

---

## 2. Shift Management

Manage:

- Shift schedules
- Shift types
- Required staffing
- Required senior staffing
- Shift assignments
- Department-specific schedules

---

## 3. Workload Intelligence

Analyze workforce workload using information such as:

- Workload score
- Workload level
- Weekly working hours
- Shift frequency
- Consecutive shifts
- Rest periods

---

## 4. Configurable Risk Rules

Operational risk rules are configurable instead of being hardcoded throughout the application.

Example configuration:

```text
Minimum Rest                  8 hours
Maximum Consecutive Shifts    4
Maximum Weekly Hours          48 hours
Required Senior Staff         2
Required Staffing             8
High Workload Threshold       75
```

This allows operational policies and thresholds to be changed without redesigning the complete business logic.

---

# 🧠 Risk Intelligence Engine

The **Risk Engine** is the core business component of ShiftShield.

It evaluates operational conditions such as:

```text
Staffing Level
      +
Senior Coverage
      +
Workload
      +
Working Hours
      +
Rest Period
      +
Consecutive Shifts
      +
Required Skills
      ↓
Risk Evaluation
      ↓
Risk Score
      ↓
Risk Level
      ↓
Risk Explanation
```

Risk levels include:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

The system does not only display a risk score.

It also provides the contributing operational factors behind the risk.

### Example

```text
ICU Night Shift

Required Staff:       8
Assigned Staff:       6

Senior Required:      2
Senior Assigned:      1

Workload:              HIGH

Risk Score:            78
Risk Level:            HIGH
```

Possible contributing factors:

- Staffing below requirement
- Insufficient senior coverage
- High workload

---

# 🔬 Shift Scenario Simulator

One of the major features of ShiftShield is the **What-If Shift Scenario Simulator**.

Instead of immediately modifying the live schedule, a supervisor can first evaluate the potential impact of a proposed action.

### Current Situation

```text
Required Staff:     8
Assigned Staff:     6

Senior Required:    2
Senior Assigned:     1

Risk Score:         78
Risk Level:         HIGH
```

### Proposed Scenario

Suppose an eligible staff member is selected:

```text
Candidate:
Priya Sharma
```

The system simulates the proposed assignment.

### Simulated Result

```text
Assigned Staff:
6 → 7

Senior Coverage:
1/2 → 2/2

Risk:
78 HIGH → 48 MEDIUM
```

The live database is not changed during simulation.

Only after the authorized user approves the scenario is the actual change applied.

```text
Simulation
     ↓
Evaluate Impact
     ↓
Supervisor Decision
     ↓
Apply Scenario
     ↓
Update Assignment
     ↓
Recalculate Risk
     ↓
Generate Notification
     ↓
Create Audit Log
```

---

# 👤 Role-Based Command Centers

ShiftShield provides role-specific operational interfaces.

## CEO

Focuses on enterprise-level intelligence:

- Dashboard
- Risk Overview
- Departments
- Analytics
- Reports

---

## COO

Focuses on operational decision-making:

- Dashboard
- Risk Overview
- Actions
- Departments
- Reports

---

## HR

Focuses on workforce management:

- Dashboard
- Staff Management
- Workforce
- Shifts
- Risks

---

## Nursing Superintendent

Focuses on nursing operations:

- Dashboard
- Nursing Staff
- Shifts
- Risk Overview
- Analytics

---

## Department Head

Focuses on department-level operations:

- Dashboard
- Department Staff
- Shifts
- Assignments
- Risk Overview
- Analytics

---

## Supervisor

Focuses on immediate operational actions:

- Dashboard
- Today
- Shifts
- Assignments
- Risk Overview
- Scenario Simulator
- Notifications

---

## Staff

Focuses on personal workforce information:

- Dashboard
- My Shifts
- Hours This Week
- My Workload
- My Requests
- Notifications

---

## System Administrator

Manages system configuration:

- Dashboard
- Organizations
- Users
- Departments
- Staff
- Configuration
- Risk Rules
- Audit Logs

---

# 🔐 Security Architecture

ShiftShield uses:

- Spring Security
- JWT Authentication
- Role-Based Access Control
- BCrypt password hashing
- Backend authorization
- Organization-level data isolation
- Request validation
- Controlled operational actions
- Audit logging

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
JWT Authentication Filter
  ↓
SecurityContext
  ↓
Authorization
  ↓
Protected API
```

### Authentication vs Authorization

```text
Authentication
→ Who are you?

Authorization
→ What are you allowed to access?
```

Frontend route protection improves user experience, while actual authorization is enforced by the backend.

---

# 🏢 Multi-Tenant Architecture

ShiftShield is designed with organization-level data isolation.

Example:

```text
Hospital A
 ├── Departments
 ├── Staff
 ├── Shifts
 └── Risks

Hospital B
 ├── Departments
 ├── Staff
 ├── Shifts
 └── Risks
```

Hospital A should not be able to access Hospital B's operational data.

The backend is responsible for enforcing organization-level access rather than relying only on frontend visibility.

---

# 🏗️ System Architecture

```text
                    USERS
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
          │      Spring Boot      │
          │                        │
          │ Controllers            │
          │ Services               │
          │ Security               │
          │ Risk Engine            │
          │ Validation             │
          │ Exception Handling     │
          └───────────┬────────────┘
                      │
                 JPA / Hibernate
                      │
                      ▼
                   MySQL
```

---

# 💻 Technology Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS / CSS
- Recharts
- Lucide Icons

## Backend

- Java
- Spring Boot
- Spring MVC
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Bean Validation
- REST APIs

## Database

- MySQL

## Development Tools

- Git
- GitHub
- VS Code
- IntelliJ IDEA / Eclipse
- Postman
- Maven

## Deployment

- Vercel for frontend
- Cloud hosting for Spring Boot backend
- Cloud-hosted relational database

---

# 🗄️ Database Design

Major entities include:

```text
organizations
users
hospital_configurations
departments
staff
skills
staff_skills
staff_availability
shifts
shift_assignments
workload_records
risk_rules
risk_assessments
notifications
shift_change_requests
simulation_scenarios
scenario_changes
audit_logs
```

### Entity Relationship Overview

```text
Organization
     │
     ├──────── Departments
     │              │
     │              └──────── Staff
     │                          │
     │                          ├── Skills
     │                          └── Availability
     │
     └──────── Users

Department
     │
     └──────── Shifts
                  │
                  └──────── Shift Assignments
                                │
                                └──────── Staff

Shift
  │
  ├── Workload
  │
  └── Risk Assessment
             │
             └── Scenario Simulation
                         │
                         ├── Scenario Changes
                         └── Audit Log
```

---

# 🔄 Backend Request Flow

A typical request follows this architecture:

```text
React
  ↓
Axios
  ↓
HTTP Request
  ↓
JWT Filter
  ↓
Authentication
  ↓
Authorization
  ↓
Controller
  ↓
DTO Validation
  ↓
Service Layer
  ↓
Risk Engine / Business Logic
  ↓
Repository
  ↓
JPA / Hibernate
  ↓
MySQL
```

The response travels back through the same layers:

```text
MySQL
  ↓
Hibernate
  ↓
Repository
  ↓
Service
  ↓
Controller
  ↓
JSON Response
  ↓
Axios
  ↓
React
```

---

# 📁 Project Structure

```text
ShiftShield/
│
├── shiftshield-backend/
│   │
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── shiftshield/
│   │   │   │           ├── controller/
│   │   │   │           ├── service/
│   │   │   │           ├── repository/
│   │   │   │           ├── entity/
│   │   │   │           ├── dto/
│   │   │   │           ├── security/
│   │   │   │           ├── risk/
│   │   │   │           ├── exception/
│   │   │   │           └── config/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── shiftshield-frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── database/
│   └── dataset/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

---

# 📊 Example Operational Scenario

## ICU Night Shift

```text
Required Staff       = 8
Assigned Staff       = 6

Required Senior      = 2
Assigned Senior      = 1

Workload             = HIGH

Risk Score            = 78
Risk Level            = HIGH
```

The supervisor selects an eligible staff member:

```text
Priya Sharma
```

### Simulation

```text
Staff:
6 → 7

Senior Coverage:
1 → 2

Risk:
78 HIGH
   ↓
48 MEDIUM
```

The supervisor reviews the impact and applies the scenario.

After application:

```text
Assignment Updated
       ↓
Risk Recalculated
       ↓
Notification Created
       ↓
Audit Log Created
       ↓
Updated Staff View
```

This demonstrates the complete ShiftShield decision-support lifecycle.

---

# 🧪 Testing Strategy

Testing can be performed at multiple levels.

## Backend

- Unit testing
- Service testing
- Controller/API testing
- Security testing
- Validation testing
- Risk Engine testing

## Frontend

- Component testing
- API integration testing
- Route testing
- Role-based UI testing

## End-to-End

Primary workflow:

```text
Supervisor Login
      ↓
ICU Risk
      ↓
Risk = 78 HIGH
      ↓
Find Eligible Staff
      ↓
Run Simulation
      ↓
Risk = 48 MEDIUM
      ↓
Apply Scenario
      ↓
Notification
      ↓
Audit Log
      ↓
Staff Login
      ↓
Updated Shift
```

---

# 🛡️ Security Considerations

The application is designed with the following security principles:

- JWT-based authentication
- BCrypt password hashing
- Role-based authorization
- Backend API protection
- Organization-level data isolation
- Input validation
- Controlled operational actions
- Audit logging
- Environment-based configuration for secrets

Sensitive credentials should never be committed to the repository.

---

# 📈 Future Scope

ShiftShield can be extended with predictive intelligence and additional enterprise capabilities.

## Predictive Workforce Risk

Historical workforce data can be used to predict:

- Future staffing shortages
- Overtime risk
- Absence risk
- Workload spikes
- Department demand

Possible architecture:

```text
Historical Data
      ↓
Feature Engineering
      ↓
Machine Learning Model
      ↓
Predicted Risk
      ↓
Risk Engine
      ↓
Decision Support
```

---

## Additional Future Features

- Automated demand forecasting
- Staff absence prediction
- Intelligent shift recommendations
- Optimization-based scheduling
- Real-time hospital integrations
- Advanced analytics
- Mobile application
- Email/SMS notifications
- Redis caching
- Message queues
- Kubernetes-based deployment
- Centralized monitoring and observability

---

# 🎓 Academic & Placement Project Value

ShiftShield demonstrates practical implementation of:

- Full-stack development
- Java
- Spring Boot
- REST API design
- Spring Security
- JWT
- Role-Based Access Control
- JPA/Hibernate
- MySQL
- React
- React Router
- Database design
- Business logic
- Configurable rule engines
- Operational risk intelligence
- Decision-support systems
- What-if simulation
- Audit logging
- Multi-tenant architecture
- API integration
- Deployment

---

# 🧩 Why ShiftShield Is Not Just CRUD

CRUD is used as the foundation for managing master and operational data such as:

```text
Staff
Departments
Shifts
Assignments
Skills
```

However, the primary business workflow is:

```text
Data
 ↓
Risk Evaluation
 ↓
Risk Explanation
 ↓
Recommended Action
 ↓
Scenario Simulation
 ↓
Human Decision
 ↓
Apply Approved Action
 ↓
Risk Recalculation
 ↓
Notification
 ↓
Audit Trail
```

The key differentiator is the ability to evaluate the operational impact of a proposed workforce decision before modifying live scheduling data.

---

# 🔍 Key Engineering Concepts Demonstrated

## Separation of Concerns

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Business logic is separated from HTTP handling and persistence.

## Dependency Injection

Spring manages application dependencies through its IoC container.

## ORM

JPA/Hibernate maps Java entities to relational database tables.

## REST Architecture

Frontend and backend communicate through RESTful HTTP APIs.

## Security

JWT and Spring Security protect backend resources.

## Decision Support

The Risk Engine and Scenario Simulator support operational decisions.

## Auditability

Important operational changes are recorded for traceability.

---

# 👨‍💻 Developer

**Aniket Pandurang Parekar**

Final Year B.E. Computer Engineering  
P.E.S. Modern College of Engineering, Pune  
Savitribai Phule Pune University

---

# 📄 Disclaimer

ShiftShield uses synthetic/demo data for development, testing, demonstration, and academic purposes.

It is not intended to replace professional medical, clinical, staffing, compliance, or administrative judgment.

Operational decisions should remain under appropriate human supervision.

---

# ⭐ Core Concept

The central idea behind ShiftShield is:

```text
             DATA
               ↓
           ANALYSIS
               ↓
        RISK DETECTION
               ↓
       CAUSE EXPLANATION
               ↓
      RECOMMENDED ACTION
               ↓
          SIMULATION
               ↓
       HUMAN DECISION
               ↓
            APPLY
               ↓
       RISK RECALCULATION
               ↓
          NOTIFICATION
               ↓
          AUDIT TRAIL
```

> **ShiftShield transforms hospital workforce data into explainable, actionable, and auditable operational decisions.**

---

## 📜 License

This project is licensed under the **MIT License**.

Copyright (c) 2026 Aniket Parekar.

See the `LICENSE` file for details.