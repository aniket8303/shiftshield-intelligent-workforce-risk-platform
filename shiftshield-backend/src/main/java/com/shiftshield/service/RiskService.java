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
                    "RISK_ALERT");
        }

        auditLogService.logAction(
                "ANALYZE_RISK",
                "RiskAssessment",
                assessment.getId(),
                "Analyzed risk for Shift #" + shiftId + ". Score: " + assessment.getRiskScore() + " ("
                        + assessment.getRiskLevel() + ")");

        return mapToResponse(assessment);
    }

    @Transactional
    public RiskAssessmentResponse simulateAssignmentRisk(Integer shiftId, Integer staffId) {

        Shift shift = getShift(shiftId);

        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByShiftId(shiftId);

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // 1. Organization isolation
        if (!staff.getOrganization().getId().equals(shift.getOrganization().getId())) {
            throw new RuntimeException(
                    "Staff does not belong to the same organization");
        }

        // 2. Staff must be active
        if (!Boolean.TRUE.equals(staff.getIsActive())) {
            throw new RuntimeException(
                    "Staff is not active and cannot be assigned");
        }

        // 3. Prevent duplicate assignment
        boolean alreadyAssigned = assignments.stream()
                .anyMatch(a -> a.getStaff().getId().equals(staffId)
                        && !"CANCELLED".equalsIgnoreCase(a.getStatus()));

        if (alreadyAssigned) {
            throw new RuntimeException(
                    "Staff is already assigned to this shift");
        }

        // 4. Create temporary simulated assignment
        ShiftAssignment simulatedAssignment = ShiftAssignment.builder()
                .shift(shift)
                .staff(staff)
                .status("SIMULATED")
                .build();

        List<ShiftAssignment> simulatedAssignments = new ArrayList<>(assignments);

        simulatedAssignments.add(simulatedAssignment);

        // 5. Calculate hypothetical risk
        RiskAssessment simulatedAssessment = riskEngine.evaluateShiftRisk(
                shift,
                simulatedAssignments);

        // Indicator that this assessment is simulation-only
        simulatedAssessment.setId(-1);

        // 6. Save scenario for historical tracking
        User currentUser = securityUtils.getCurrentUser();

        SimulationScenario scenario = new SimulationScenario();
        scenario.setOrganization(shift.getOrganization());
        scenario.setShift(shift);
        scenario.setCreatedBy(currentUser);
        scenario.setName(
                "Simulate Add " + staff.getUser().getFirstName());
        scenario.setSimulatedRiskScore(
                simulatedAssessment.getRiskScore());
        scenario.setSimulatedRiskLevel(
                simulatedAssessment.getRiskLevel());
        scenario.setIsApplied(false);

        scenario = simulationScenarioRepository.save(scenario);

        // 7. Save scenario change
        ScenarioChange change = new ScenarioChange();
        change.setSimulationScenario(scenario);
        change.setStaff(staff);
        change.setAction("ADD");

        scenarioChangeRepository.save(change);

        // 8. Return hypothetical state
        return mapToResponse(
                simulatedAssessment,
                simulatedAssignments);
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

        long totalStaff = staffRepository.countByOrganizationId(orgId);

        long totalAssessments = assessments.size();

        long highRisk = assessments.stream()
                .filter(a -> "HIGH".equals(a.getRiskLevel())
                        || "CRITICAL".equals(a.getRiskLevel()))
                .count();

        long mediumRisk = assessments.stream()
                .filter(a -> "MEDIUM".equals(a.getRiskLevel()))
                .count();

        long lowRisk = assessments.stream()
                .filter(a -> "LOW".equals(a.getRiskLevel()))
                .count();

        return new com.shiftshield.dto.RiskDashboardResponse(
                totalStaff,
                totalAssessments,
                highRisk,
                mediumRisk,
                lowRisk);
    }

    private RiskAssessmentResponse mapToResponse(
            RiskAssessment assessment) {

        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByShiftId(
                assessment.getShift().getId());

        return mapToResponse(assessment, assignments);
    }

    private RiskAssessmentResponse mapToResponse(
            RiskAssessment assessment,
            List<ShiftAssignment> assignments) {

        List<String> reasonsList;

        try {
            if (assessment.getReasons() != null) {
                reasonsList = objectMapper.readValue(
                        assessment.getReasons(),
                        new TypeReference<List<String>>() {
                        });
            } else {
                reasonsList = new ArrayList<>();
            }
        } catch (JsonProcessingException e) {
            reasonsList = new ArrayList<>();
        }

        long assignedSeniorStaff = assignments.stream()
                .filter(a -> a.getStaff().getExperienceLevel() != null
                        && a.getStaff().getExperienceLevel() >= 5)
                .count();

        long assignedStaff = assignments.stream()
                .filter(a -> !"CANCELLED".equalsIgnoreCase(a.getStatus()))
                .count();

        return RiskAssessmentResponse.builder()
                .id(assessment.getId())
                .shiftId(assessment.getShift().getId())
                .departmentName(
                        assessment.getShift()
                                .getDepartment()
                                .getName())
                .shiftDate(
                        assessment.getShift().getStartTime())
                .shiftType(
                        assessment.getShift().getType())
                .requiredStaff(
                        assessment.getShift()
                                .getRequiredStaffCount())
                .assignedStaff((int) assignedStaff)
                .requiredSeniorStaff(
                        assessment.getShift()
                                .getRequiredSeniorStaffCount())
                .assignedSeniorStaff(
                        (int) assignedSeniorStaff)
                .shiftStatus(
                        assessment.getShift().getStatus())
                .riskScore(
                        assessment.getRiskScore())
                .riskLevel(
                        assessment.getRiskLevel())
                .reasons(reasonsList)
                .calculatedAt(
                        assessment.getCalculatedAt())
                .build();
    }

    @Transactional
    public RiskAssessmentResponse applyScenario(Long scenarioId) {

        // 1. Get current organization
        Integer orgId = securityUtils.getCurrentOrganizationId();

        // 2. Find scenario
        SimulationScenario scenario = simulationScenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new RuntimeException("Simulation scenario not found"));

        // 3. Multi-tenancy protection
        if (!scenario.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Scenario does not belong to your organization");
        }

        // 4. Prevent applying the same scenario twice
        if (Boolean.TRUE.equals(scenario.getIsApplied())) {
            throw new RuntimeException("Simulation scenario has already been applied");
        }

        Shift shift = scenario.getShift();

        // 5. Get current live assignments
        List<ShiftAssignment> assignments = shiftAssignmentRepository.findByShiftId(shift.getId());

        // 6. Apply every scenario change
        List<ScenarioChange> changes = scenarioChangeRepository.findBySimulationScenarioId(scenarioId);

        for (ScenarioChange change : changes) {

            Staff staff = change.getStaff();

            if (!staff.getOrganization().getId().equals(orgId)) {
                throw new RuntimeException("Staff does not belong to your organization");
            }

            if (!staff.getIsActive()) {
                throw new RuntimeException(
                        "Cannot assign inactive staff: "
                                + staff.getUser().getFirstName());
            }

            if ("ADD".equalsIgnoreCase(change.getAction())) {

                boolean alreadyAssigned = assignments.stream()
                        .anyMatch(a -> a.getStaff().getId().equals(staff.getId())
                                && !"CANCELLED".equalsIgnoreCase(a.getStatus()));

                if (!alreadyAssigned) {

                    ShiftAssignment newAssignment = ShiftAssignment.builder()
                            .shift(shift)
                            .staff(staff)
                            .assignedBy(securityUtils.getCurrentUser())
                            .status("ASSIGNED")
                            .build();

                    shiftAssignmentRepository.save(newAssignment);

                    assignments.add(newAssignment);
                }
            }

            else if ("REMOVE".equalsIgnoreCase(change.getAction())) {

                assignments.stream()
                        .filter(a -> a.getStaff().getId().equals(staff.getId())
                                && !"CANCELLED".equalsIgnoreCase(a.getStatus()))
                        .forEach(a -> a.setStatus("CANCELLED"));
            }
        }

        // 7. Mark scenario as applied
        scenario.setIsApplied(true);
        simulationScenarioRepository.save(scenario);

        // 8. Recalculate LIVE risk
        RiskAssessment assessment = riskEngine.evaluateShiftRisk(shift, assignments);

        assessment = riskAssessmentRepository.save(assessment);

        // 9. Create notification for high/critical risk
        if ("HIGH".equals(assessment.getRiskLevel())
                || "CRITICAL".equals(assessment.getRiskLevel())) {

            User currentUser = securityUtils.getCurrentUser();

            notificationService.createNotification(
                    currentUser,
                    assessment,
                    "Risk Level " + assessment.getRiskLevel()
                            + " detected after applying Scenario #" + scenarioId
                            + " for Shift #" + shift.getId(),
                    "RISK_ALERT");
        }

        // 10. Audit trail
        auditLogService.logAction(
                "APPLY_SCENARIO",
                "SimulationScenario",
                scenario.getId().intValue(),
                "Applied Scenario #" + scenarioId
                        + " to Shift #" + shift.getId()
                        + ". Live risk: "
                        + assessment.getRiskScore()
                        + " ("
                        + assessment.getRiskLevel()
                        + ")");

        // 11. Return updated live risk
        return mapToResponse(assessment, assignments);
    }
}