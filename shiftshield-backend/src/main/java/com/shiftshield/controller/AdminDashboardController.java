package com.shiftshield.controller;

import com.shiftshield.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class AdminDashboardController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private RiskRuleRepository riskRuleRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("organizations", organizationRepository.count());
        summary.put("users", userRepository.count());
        summary.put("departments", departmentRepository.count());
        summary.put("staff", staffRepository.count());
        summary.put("riskRules", riskRuleRepository.count());
        
        return ResponseEntity.ok(summary);
    }
}
