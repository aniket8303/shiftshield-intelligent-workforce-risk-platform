package com.shiftshield.config;

import com.shiftshield.entity.Department;
import com.shiftshield.repository.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DepartmentDataFixer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    public DepartmentDataFixer(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("⏳ Running DepartmentDataFixer...");
        List<Department> departments = departmentRepository.findAll();
        boolean changed = false;

        for (Department dept : departments) {
            if (dept.getDescription() == null || dept.getDescription().trim().isEmpty() || dept.getDescription().equals("—")) {
                String newDesc = getExpectedDescription(dept.getName());
                if (newDesc != null) {
                    dept.setDescription(newDesc);
                    changed = true;
                }
            }
        }

        if (changed) {
            departmentRepository.saveAll(departments);
            System.out.println("✅ Department descriptions populated safely.");
        } else {
            System.out.println("✅ Department descriptions already populated.");
        }
    }

    private String getExpectedDescription(String name) {
        if (name == null) return null;
        
        switch (name.toUpperCase()) {
            case "ICU":
            case "INTENSIVE CARE UNIT":
                return "Critical care department responsible for continuous monitoring and treatment of patients requiring intensive medical support.";
            case "EMERGENCY":
            case "ER":
                return "Emergency care department responsible for rapid assessment, stabilization, and treatment of urgent and critical patients.";
            case "CARDIOLOGY":
                return "Specialized department providing diagnosis, monitoring, and treatment for cardiovascular conditions.";
            case "PEDIATRICS":
                return "Department providing medical care and monitoring for infants, children, and adolescents.";
            case "GENERAL WARD":
                return "Inpatient department providing routine medical and nursing care for admitted patients.";
            case "OPERATION THEATRE":
            case "OT":
                return "Surgical department responsible for operative procedures, perioperative support, and surgical coordination.";
            case "LABORATORY":
                return "Diagnostic department responsible for clinical laboratory testing and reporting.";
            case "RADIOLOGY":
                return "Diagnostic imaging department supporting clinical diagnosis through imaging services.";
            case "PHARMACY":
                return "Medication management department responsible for dispensing, inventory, and medication safety.";
            case "ADMINISTRATION":
            case "ADMIN":
                return "Administrative department supporting hospital operations, coordination, and organizational services.";
            default:
                return "Specialized clinical or administrative department.";
        }
    }
}
