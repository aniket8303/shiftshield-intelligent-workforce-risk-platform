SHIFTShield SYNTHETIC DEVELOPMENT DATASET
=========================================
100% synthetic data for local development/demo/testing. Not real hospital data.

Organization: Sunrise Multispeciality Hospital, Pune, Maharashtra
30 days of availability, 900 shifts, 100 staff, workload, risks, notifications,
scenario simulation and audit records.

Demo credentials (create passwords through BCrypt in Spring Boot DataInitializer):
admin@shiftshield.com / Admin@123
ceo@shiftshield.com / CEO@123
coo@shiftshield.com / COO@123
hr@shiftshield.com / HR@123
nursing@shiftshield.com / Nurse@123
head.icu@shiftshield.com / Dept@123
supervisor@shiftshield.com / Supervisor@123
priya@shiftshield.com / Staff@123

Primary demo:
2026-09-16 ICU NIGHT
Required 8, assigned 6, senior required 2, senior assigned 1, workload HIGH, risk 78.
Simulation: 78 -> 48, reduction 30.

Import order:
organizations, users (via DataInitializer), hospital_configurations, departments,
skills, staff, staff_skills, staff_availability, shifts, shift_assignments,
workload_records, risk_rules, risk_assessments, notifications,
simulation_scenarios, scenario_changes, audit_logs.
