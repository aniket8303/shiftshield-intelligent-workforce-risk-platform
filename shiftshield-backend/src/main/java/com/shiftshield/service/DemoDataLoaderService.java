package com.shiftshield.service;

import com.shiftshield.entity.*;
import com.shiftshield.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DemoDataLoaderService {

    private final OrganizationRepository orgRepo;
    private final DepartmentRepository deptRepo;
    private final UserRepository userRepo;
    private final StaffRepository staffRepo;
    private final ShiftRepository shiftRepo;
    private final ShiftAssignmentRepository shiftAssignmentRepo;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataLoaderService(
            OrganizationRepository orgRepo,
            DepartmentRepository deptRepo,
            UserRepository userRepo,
            StaffRepository staffRepo,
            ShiftRepository shiftRepo,
            ShiftAssignmentRepository shiftAssignmentRepo,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder) {
        this.orgRepo = orgRepo;
        this.deptRepo = deptRepo;
        this.userRepo = userRepo;
        this.staffRepo = staffRepo;
        this.shiftRepo = shiftRepo;
        this.shiftAssignmentRepo = shiftAssignmentRepo;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String loadDemoData() throws Exception {
        if (shiftRepo.count() > 0 || staffRepo.count() > 0) {
            return "Demo data already loaded.";
        }

        System.out.println("⏳ Starting Large Demo Data Import...");

        List<Organization> orgs = orgRepo.findAll();
        if (orgs.isEmpty()) {
            return "Essential data missing. Please run EssentialDataInitializer first.";
        }
        Organization defaultOrg = orgs.get(0);

        // 1. STAFF
        Map<Integer, Staff> staffMap = new HashMap<>();
        try (BufferedReader br = readCsv("staff.csv")) {
            br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                String[] cols = line.split(",");
                Staff staff = new Staff();
                staff.setOrganization(defaultOrg);
                staff.setDepartment(deptRepo.findById(Integer.parseInt(cols[4])).orElse(null));
                staff.setDesignation(cols[5]);

                // The CSV doesn't map directly to user_id, but we match by full_name/email
                String fullName = cols[3];
                String[] n = fullName.split(" ", 2);
                String expectedEmail = n[0].toLowerCase() + "."
                        + (n.length > 1 ? n[1].toLowerCase().replaceAll("\\s+", "") : "") + staffMap.size()
                        + "@shiftshield.com";

                User matchedUser = userRepo.findByEmail(expectedEmail).orElse(null);

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

        // 2. SHIFTS
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
                shift.setDepartment(deptRepo.findById(Integer.parseInt(cols[2])).orElse(null));
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

        // 3. SHIFT ASSIGNMENTS
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

        // 4. AUDIT LOGS
        List<AuditLog> auditsToSave = new ArrayList<>();
        Map<Integer, User> userMapForAudits = new HashMap<>(); // Cache for audits
        for (User u : userRepo.findAll()) {
            userMapForAudits.put(u.getId(), u);
        }
        
        try (BufferedReader br = readCsv("audit_logs.csv")) {
            br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                String[] cols = line.split(",");
                AuditLog log = new AuditLog();
                log.setOrganization(defaultOrg);

                User auditUser = userMapForAudits.get(Integer.parseInt(cols[2]));
                if (auditUser == null) {
                    auditUser = userMapForAudits.values().iterator().next(); // fallback
                }
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

        System.out.println("✅ Large Demo Data Import Complete.");
        return "Demo data imported successfully.";
    }

    private BufferedReader readCsv(String fileName) throws Exception {
        InputStream inputStream =
                DemoDataLoaderService.class.getClassLoader()
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
