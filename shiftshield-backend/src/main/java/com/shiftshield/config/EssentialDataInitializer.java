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
public class EssentialDataInitializer {

    @Bean
    @Transactional
    public CommandLineRunner initData(
            OrganizationRepository orgRepo,
            DepartmentRepository deptRepo,
            UserRepository userRepo,
            RiskRuleRepository riskRuleRepo,
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

            System.out.println("✅ Essential Data Initialization Complete.");
        };
    }

    private BufferedReader readCsv(String fileName) throws Exception {
        InputStream inputStream =
                EssentialDataInitializer.class.getClassLoader()
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
