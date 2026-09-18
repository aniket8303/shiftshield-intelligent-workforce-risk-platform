package com.shiftshield.config;

import com.shiftshield.entity.*;
import com.shiftshield.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

            System.out.println("⏳ Starting Minimal Core Data Initialization...");

            // 1. DEFAULT ORGANIZATION
            Organization org = new Organization();
            org.setName("Metropolis General Hospital");
            org.setHospitalCode("MGH-001");
            org.setLocation("123 Health Ave, New York, NY");
            org.setStatus("ACTIVE");
            Organization defaultOrg = orgRepo.save(org);

            // 2. ESSENTIAL DEPARTMENTS
            List<String> deptNames = List.of(
                    "ICU", "EMERGENCY", "CARDIOLOGY", "PEDIATRICS", "GENERAL WARD",
                    "OPERATION THEATRE", "LABORATORY", "RADIOLOGY", "PHARMACY", "ADMINISTRATION"
            );

            for (String deptName : deptNames) {
                Department dept = new Department();
                dept.setOrganization(defaultOrg);
                dept.setName(deptName);
                dept.setCode(deptName.replaceAll("\\s+", "").toUpperCase());
                dept.setDescription(deptName + " Department");
                deptRepo.save(dept);
            }

            // 3. ESSENTIAL USERS
            createUser(userRepo, defaultOrg, passwordEncoder, "System", "Admin", "admin@shiftshield.com", "Admin@123", "SYSTEM_ADMIN", "555-0101");
            createUser(userRepo, defaultOrg, passwordEncoder, "Sarah", "CEO", "ceo@shiftshield.com", "CEO@123", "CEO", "555-0102");
            createUser(userRepo, defaultOrg, passwordEncoder, "Mark", "COO", "coo@shiftshield.com", "COO@123", "COO", "555-0103");
            createUser(userRepo, defaultOrg, passwordEncoder, "Elena", "HR", "hr@shiftshield.com", "HR@123", "HR", "555-0104");
            createUser(userRepo, defaultOrg, passwordEncoder, "John", "Nursing", "nursing@shiftshield.com", "Nurse@123", "NURSING_SUPERINTENDENT", "555-0105");
            createUser(userRepo, defaultOrg, passwordEncoder, "Dr. Alice", "ICU", "head.icu@shiftshield.com", "Dept@123", "DEPARTMENT_HEAD", "555-0106");
            createUser(userRepo, defaultOrg, passwordEncoder, "Tom", "Supervisor", "supervisor@shiftshield.com", "Supervisor@123", "SUPERVISOR", "555-0107");
            createUser(userRepo, defaultOrg, passwordEncoder, "Priya", "Staff", "priya@shiftshield.com", "Staff@123", "STAFF", "555-0108");

            System.out.println("✅ Essential Core Data Initialization Complete.");
        };
    }

    private void createUser(UserRepository userRepo, Organization org, PasswordEncoder encoder,
                            String firstName, String lastName, String email, String pwd, String role, String phone) {
        User user = new User();
        user.setOrganization(org);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(encoder.encode(pwd));
        user.setRole(role);
        user.setStatus("ACTIVE");
        user.setPhone(phone);
        userRepo.save(user);
    }
}
