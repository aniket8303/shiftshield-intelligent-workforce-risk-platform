package com.shiftshield.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shiftshield.dto.RiskAssessmentResponse;
import com.shiftshield.entity.*;
import com.shiftshield.repository.*;
import com.shiftshield.risk.RiskEngine;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RiskService {

    private final RiskAssessmentRepository riskAssessmentRepository;
    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final StaffRepository staffRepository;
    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;
    private final ObjectMapper objectMapper;
    private final AuditLogService auditLogService;
    private final SimulationScenarioRepository simulationScenarioRepository;
    private final ScenarioChangeRepository scenarioChangeRepository;
    private final RiskEngine riskEngine;

    public RiskService(
            RiskAssessmentRepository riskAssessmentRepository,
            ShiftRepository shiftRepository,
            ShiftAssignmentRepository shiftAssignmentRepository,
            StaffRepository staffRepository,
            NotificationService notificationService,
            SecurityUtils securityUtils,
            ObjectMapper objectMapper,
            AuditLogService auditLogService,
            SimulationScenarioRepository simulationScenarioRepository,
            ScenarioChangeRepository scenarioChangeRepository,
            RiskEngine riskEngine) {
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.shiftRepository = shiftRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
        this.staffRepository = staffRepository;
        this.notificationService = notificationService;
        this.securityUtils = securityUtils;
        this.objectMapper = objectMapper;
        this.auditLogService = auditLogService;
        this.simulationScenarioRepository = simulationScenarioRepository;
        this.scenarioChangeRepository = scenarioChangeRepository;
        this.riskEngine = riskEngine;
    }

    @Transactional
    public RiskAssessmentResponse analyzeShiftRisk(Integer shiftId) {
        Shift shift = getShift(shiftId);
        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByShiftId(shiftId);
        
        RiskAssessment assessment = riskEngine.evaluateShiftRisk(shift, assignments);
        assessment = riskAssessmentRepository.save(assessment);
        
        if ("HIGH".equals(assessment.getRiskLevel()) || "CRITICAL".equals(assessment.getRiskLevel())) {
            User currentUser = securityUtils.getCurrentUser();
            notificationService.createNotification(
                    currentUser,
                    assessment,
                    "Risk Level " + assessment.getRiskLevel() + " detected for Shift #" + shiftId,
                    "RISK_ALERT"
            );
        }

        auditLogService.logAction(
                "ANALYZE_RISK",
                "RiskAssessment",
                assessment.getId(),
                "Analyzed risk for Shift #" + shiftId + ". Score: " + assessment.getRiskScore() + " (" + assessment.getRiskLevel() + ")"
        );

        return mapToResponse(assessment);
    }

    @Transactional
    public RiskAssessmentResponse simulateAssignmentRisk(Integer shiftId, Integer staffId) {
        Shift shift = getShift(shiftId);
        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByShiftId(shiftId);
        
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (!staff.getOrganization().getId().equals(shift.getOrganization().getId())) {
            throw new RuntimeException("Staff does not belong to the same organization");
        }

        // Add the simulated assignment
        ShiftAssignment simulatedAssignment = ShiftAssignment.builder()
                .shift(shift)
                .staff(staff)
                .status("SIMULATED")
                .build();
        
        List<ShiftAssignment> simulatedAssignments = new ArrayList<>(assignments);
        simulatedAssignments.add(simulatedAssignment);

        // Calculate Risk using RiskEngine
        RiskAssessment simulatedAssessment = riskEngine.evaluateShiftRisk(shift, simulatedAssignments);
        simulatedAssessment.setId(-1); // Indicator that it's a simulation

        // Save to SimulationScenario for historical tracking and applying later
        User currentUser = securityUtils.getCurrentUser();
        
        SimulationScenario scenario = new SimulationScenario();
        scenario.setOrganization(shift.getOrganization());
        scenario.setShift(shift);
        scenario.setCreatedBy(currentUser);
        scenario.setName("Simulate Add " + staff.getUser().getFirstName());
        scenario.setSimulatedRiskScore(simulatedAssessment.getRiskScore());
        scenario.setSimulatedRiskLevel(simulatedAssessment.getRiskLevel());
        scenario.setIsApplied(false);
        scenario = simulationScenarioRepository.save(scenario);

        ScenarioChange change = new ScenarioChange();
        change.setSimulationScenario(scenario);
        change.setStaff(staff);
        change.setAction("ADD");
        scenarioChangeRepository.save(change);

        return mapToResponse(simulatedAssessment);
    }

    private Shift getShift(Integer shiftId) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
        
        if (!shift.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Unauthorized access to shift");
        }
        return shift;
    }

    public List<RiskAssessmentResponse> getRecentAssessments() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        return riskAssessmentRepository.findByOrganizationId(orgId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public com.shiftshield.dto.RiskDashboardResponse getRiskDashboardSummary() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        List<RiskAssessment> assessments = riskAssessmentRepository.findByOrganizationId(orgId);
        long totalStaff = staffRepository.count();
        long totalAssessments = assessments.size();
        long highRisk = assessments.stream().filter(a -> "HIGH".equals(a.getRiskLevel()) || "CRITICAL".equals(a.getRiskLevel())).count();
        long mediumRisk = assessments.stream().filter(a -> "MEDIUM".equals(a.getRiskLevel())).count();
        long lowRisk = assessments.stream().filter(a -> "LOW".equals(a.getRiskLevel())).count();
        
        return new com.shiftshield.dto.RiskDashboardResponse(totalStaff, totalAssessments, highRisk, mediumRisk, lowRisk);
    }

    private RiskAssessmentResponse mapToResponse(RiskAssessment assessment) {
        List<String> reasonsList;
        try {
            if (assessment.getReasons() != null) {
                reasonsList = objectMapper.readValue(assessment.getReasons(), new TypeReference<List<String>>() {});
            } else {
                reasonsList = new ArrayList<>();
            }
        } catch (JsonProcessingException e) {
            reasonsList = new ArrayList<>();
        }

        return RiskAssessmentResponse.builder()
                .id(assessment.getId())
                .shiftId(assessment.getShift().getId())
                .departmentName(assessment.getShift().getDepartment().getName())
                .shiftDate(assessment.getShift().getStartTime())
                .shiftType(assessment.getShift().getType())
                .requiredStaff(assessment.getShift().getRequiredStaffCount())
                .assignedStaff(assessment.getShift().getAssignedStaffCount())
                .requiredSeniorStaff(assessment.getShift().getRequiredSeniorStaffCount())
                .assignedSeniorStaff(0) // Default to 0 as it's not tracked directly on Shift entity
                .shiftStatus(assessment.getShift().getStatus())
                .riskScore(assessment.getRiskScore())
                .riskLevel(assessment.getRiskLevel())
                .reasons(reasonsList)
                .calculatedAt(assessment.getCalculatedAt())
                .build();
    }
}