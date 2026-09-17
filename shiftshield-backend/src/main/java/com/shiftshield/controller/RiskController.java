package com.shiftshield.controller;

import com.shiftshield.dto.RiskAssessmentResponse;
import com.shiftshield.service.RiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/risk")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @PostMapping("/analyze-shift/{shiftId}")
    @PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'CEO', 'COO', 'HR', 'NURSING_SUPERINTENDENT', 'DEPARTMENT_HEAD', 'SUPERVISOR')")
    public ResponseEntity<RiskAssessmentResponse> analyzeShiftRisk(@PathVariable Integer shiftId) {
        return ResponseEntity.ok(riskService.analyzeShiftRisk(shiftId));
    }

    @GetMapping("/assessments")
    public ResponseEntity<List<RiskAssessmentResponse>> getRecentAssessments() {
        return ResponseEntity.ok(riskService.getRecentAssessments());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<com.shiftshield.dto.RiskDashboardResponse> getRiskDashboardSummary() {
        return ResponseEntity.ok(riskService.getRiskDashboardSummary());
    }

    @PostMapping("/simulate-assignment/{shiftId}")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'NURSING_SUPERINTENDENT', 'DEPARTMENT_HEAD', 'SYSTEM_ADMIN')")
    public ResponseEntity<RiskAssessmentResponse> simulateAssignmentRisk(
            @PathVariable Integer shiftId,
            @RequestParam Integer staffId) {
        return ResponseEntity.ok(riskService.simulateAssignmentRisk(shiftId, staffId));
    }
}