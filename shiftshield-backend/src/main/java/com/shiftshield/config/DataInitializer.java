package com.shiftshield.config;

import com.shiftshield.entity.*;
import com.shiftshield.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    public CommandLineRunner initData(
            OrganizationRepository orgRepo,
            DepartmentRepository deptRepo,
            UserRepository userRepo,
            ShiftRepository shiftRepo,
            ShiftAssignmentRepository shiftAssignmentRepo,
            RiskRuleRepository riskRuleRepo,
            StaffRepository staffRepo,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            if (orgRepo.count() > 0) {
                return; // Data already seeded
            }

            System.out.println("⏳ Starting Data Initialization from CSV...");

            // 1. ORGANIZATIONS
            Map<Integer, Organization> orgMap = new HashMap<>();
            try (BufferedReader br = readCsv("organizations.csv")) {
                br.readLine(); // skip header
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    Organization org = new Organization();
                    org.setName(cols[1]);
                    org.setHospitalCode(cols[2]);
                    org.setLocation(cols[3] + ", " + cols[4] + ", " + cols[5]);
                    org.setStatus(cols[7]);
                    org = orgRepo.save(org);
                    orgMap.put(Integer.parseInt(cols[0]), org);
                }
            }
            Organization defaultOrg = orgMap.values().iterator().next();

            // 2. DEPARTMENTS
            Map<Integer, Department> deptMap = new HashMap<>();
            try (BufferedReader br = readCsv("departments.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    Department dept = new Department();
                    dept.setOrganization(defaultOrg);
                    dept.setName(cols[2]);
                    dept.setCode(cols[2].replaceAll("\\s+", "").toUpperCase());
                    dept = deptRepo.save(dept);
                    deptMap.put(Integer.parseInt(cols[0]), dept);
                }
            }

            // 3. USERS
            Map<Integer, User> userMap = new HashMap<>();
            try (BufferedReader br = readCsv("users.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    User user = new User();
                    user.setOrganization(defaultOrg);
                    user.setEmail(cols[2]);
                    String[] names = cols[3].split(" ", 2);
                    user.setFirstName(names[0]);
                    user.setLastName(names.length > 1 ? names[1] : "");
                    user.setRole(cols[4]);
                    user.setStatus(cols[6]);
                    user.setPhone("555-010" + cols[0]);

                    // Assign passwords according to user role logic requested by prompt
                    if (user.getEmail().equals("admin@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("Admin@123"));
                    else if (user.getEmail().equals("ceo@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("CEO@123"));
                    else if (user.getEmail().equals("coo@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("COO@123"));
                    else if (user.getEmail().equals("hr@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("HR@123"));
                    else if (user.getEmail().equals("nursing@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("Nurse@123"));
                    else if (user.getEmail().equals("head.icu@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("Dept@123"));
                    else if (user.getEmail().equals("supervisor@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("Supervisor@123"));
                    else if (user.getEmail().equals("priya@shiftshield.com"))
                        user.setPassword(passwordEncoder.encode("Staff@123"));
                    else
                        user.setPassword(passwordEncoder.encode("Staff@123")); // Default for other staff

                    user = userRepo.save(user);
                    userMap.put(Integer.parseInt(cols[0]), user);
                }
            }

            // 4. STAFF
            Map<Integer, Staff> staffMap = new HashMap<>();
            try (BufferedReader br = readCsv("staff.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    Staff staff = new Staff();
                    staff.setOrganization(defaultOrg);
                    staff.setDepartment(deptMap.get(Integer.parseInt(cols[4])));
                    staff.setDesignation(cols[5]);

                    // The CSV doesn't map directly to user_id, but we match by full_name/email
                    String fullName = cols[3];
                    String[] n = fullName.split(" ", 2);
                    String expectedEmail = n[0].toLowerCase() + "."
                            + (n.length > 1 ? n[1].toLowerCase().replaceAll("\\s+", "") : "") + staffMap.size()
                            + "@shiftshield.com";

                    User matchedUser = userMap.values().stream()
                            .filter(u -> (u.getFirstName() + " " + u.getLastName()).trim()
                                    .equalsIgnoreCase(fullName.trim())
                                    || u.getEmail().equalsIgnoreCase(expectedEmail))
                            .findFirst()
                            .orElse(null);

                    if (matchedUser == null) {
                        matchedUser = userRepo.findByEmail(expectedEmail).orElse(null);
                    }

                    if (matchedUser == null) {
                        // Fallback: Create user if missing in users.csv but in staff.csv
                        matchedUser = new User();
                        matchedUser.setOrganization(defaultOrg);
                        matchedUser.setFirstName(n[0]);
                        matchedUser.setLastName(n.length > 1 ? n[1] : "");
                        matchedUser.setEmail(expectedEmail);
                        matchedUser.setPassword(passwordEncoder.encode("Staff@123"));
                        matchedUser.setRole("STAFF");
                        matchedUser.setStatus("ACTIVE");
                        matchedUser.setPhone("555-010" + staffMap.size());
                        matchedUser = userRepo.save(matchedUser);
                        userMap.put(matchedUser.getId(), matchedUser);
                    }
                    staff.setUser(matchedUser);

                    // Rough parsing for experience/seniority since not in CSV exactly
                    staff.setExperienceLevel(cols[5].contains("Senior") ? 6 : 2);
                    staff.setIsActive(cols[9].equals("ACTIVE"));
                    staff.setEmployeeId("EMP" + String.format("%04d", Integer.parseInt(cols[0])));
                    staff.setEmploymentStatus("FULL_TIME");

                    staff = staffRepo.save(staff);
                    staffMap.put(Integer.parseInt(cols[0]), staff);
                }
            }

            // 5. RISK RULES
            try (BufferedReader br = readCsv("risk_rules.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    RiskRule rule = new RiskRule();
                    rule.setOrganization(defaultOrg);
                    rule.setRuleName(cols[2]);
                    rule.setThresholdValue(Double.parseDouble(cols[4]));
                    rule.setEnabled("TRUE".equalsIgnoreCase(cols[6]));
                    riskRuleRepo.save(rule);
                }
            }

            // 6. SHIFTS
            Map<Integer, Shift> shiftMap = new HashMap<>();
            List<Shift> shiftsToSave = new ArrayList<>();
            DateTimeFormatter shiftTimeFormatter = DateTimeFormatter.ofPattern("HH:mm");

            try (BufferedReader br = readCsv("shifts.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    Shift shift = new Shift();
                    shift.setOrganization(defaultOrg);
                    shift.setDepartment(deptMap.get(Integer.parseInt(cols[2])));
                    shift.setType(cols[4]);

                    // Parse date and time
                    String datePart = cols[3];
                    String startTimePart = cols[5];
                    String endTimePart = cols[6];

                    LocalDateTime start = LocalDateTime
                            .parse(datePart + "T" + startTimePart + (startTimePart.length() == 5 ? ":00" : ""));
                    LocalDateTime end = LocalDateTime
                            .parse(datePart + "T" + endTimePart + (endTimePart.length() == 5 ? ":00" : ""));
                    if (cols[4].equals("NIGHT") || end.isBefore(start)) {
                        end = end.plusDays(1); // Night shifts cross midnight
                    }
                    shift.setStartTime(start);
                    shift.setEndTime(end);

                    shift.setRequiredStaffCount(Integer.parseInt(cols[7]));
                    shift.setAssignedStaffCount(Integer.parseInt(cols[8]));
                    shift.setRequiredSeniorStaffCount(Integer.parseInt(cols[9]));
                    shift.setStatus(cols[12]);

                    shift = shiftRepo.save(shift);
                    shiftMap.put(Integer.parseInt(cols[0]), shift);
                }
            }

            // 7. SHIFT ASSIGNMENTS
            List<ShiftAssignment> assignmentsToSave = new ArrayList<>();
            try (BufferedReader br = readCsv("shift_assignments.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    ShiftAssignment sa = new ShiftAssignment();
                    sa.setShift(shiftMap.get(Integer.parseInt(cols[1])));
                    sa.setStaff(staffMap.get(Integer.parseInt(cols[2])));
                    sa.setStatus(cols[3]);
                    sa.setAssignedAt(LocalDateTime.now());
                    assignmentsToSave.add(sa);

                    // Save in batches of 1000 to avoid memory issues
                    if (assignmentsToSave.size() >= 1000) {
                        shiftAssignmentRepo.saveAll(assignmentsToSave);
                        assignmentsToSave.clear();
                    }
                }
                if (!assignmentsToSave.isEmpty()) {
                    shiftAssignmentRepo.saveAll(assignmentsToSave);
                }
            }

            // 8. AUDIT LOGS
            List<AuditLog> auditsToSave = new ArrayList<>();
            try (BufferedReader br = readCsv("audit_logs.csv")) {
                br.readLine();
                String line;
                while ((line = br.readLine()) != null) {
                    String[] cols = line.split(",");
                    AuditLog log = new AuditLog();
                    log.setOrganization(defaultOrg);

                    User auditUser = userMap.get(Integer.parseInt(cols[2]));
                    if (auditUser == null)
                        auditUser = userMap.values().iterator().next(); // fallback
                    log.setUser(auditUser);

                    log.setAction(cols[3]);
                    log.setEntityType(cols[4]);
                    log.setEntityId(Integer.parseInt(cols[5]));
                    log.setDetails(cols.length > 6 ? cols[6] : "Action executed");

                    String timestampStr = cols[1];
                    log.setTimestamp(LocalDateTime.parse(timestampStr.replace(" ", "T")));
                    auditsToSave.add(log);
                }
                auditLogRepository.saveAll(auditsToSave);
            } catch (Exception e) {
                System.out.println("No valid audit logs parsed or missing file, continuing...");
            }

            System.out.println("✅ Data Initialization Complete. Seeded Database with dataset from CSV.");
        };
    }

    private BufferedReader readCsv(String fileName) throws Exception {
        InputStream inputStream =
                DataInitializer.class.getClassLoader()
                        .getResourceAsStream("data/" + fileName);

        if (inputStream == null) {
            throw new IllegalStateException(
                    "CSV file not found in classpath: data/" + fileName
            );
        }

        return new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8)
        );
    }
}
