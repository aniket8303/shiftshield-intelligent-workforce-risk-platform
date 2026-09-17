package com.shiftshield.service;

import com.shiftshield.dto.DashboardMetricsResponse;
import com.shiftshield.dto.ShiftResponse;
import com.shiftshield.entity.User;
import com.shiftshield.entity.Staff;
import com.shiftshield.repository.*;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StaffRepository staffRepository;
    private final ShiftRepository shiftRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationRepository notificationRepository;
    private final SecurityUtils securityUtils;
    private final ShiftService shiftService;
    private final RiskService riskService;

    public DashboardService(StaffRepository staffRepository,
                            ShiftRepository shiftRepository,
                            RiskAssessmentRepository riskAssessmentRepository,
                            DepartmentRepository departmentRepository,
                            NotificationRepository notificationRepository,
                            SecurityUtils securityUtils,
                            ShiftService shiftService,
                            RiskService riskService) {
        this.staffRepository = staffRepository;
        this.shiftRepository = shiftRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.departmentRepository = departmentRepository;
        this.notificationRepository = notificationRepository;
        this.securityUtils = securityUtils;
        this.shiftService = shiftService;
        this.riskService = riskService;
    }

    public DashboardMetricsResponse getDashboardMetrics() {
        User currentUser = securityUtils.getCurrentUser();
        Integer orgId = currentUser.getOrganization().getId();
        String role = currentUser.getRole();
        
        Integer targetDeptId = null;
        if (role.equals("DEPARTMENT_HEAD")) {
            Staff staff = staffRepository.findAll().stream()
                .filter(s -> s.getUser().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Department Head staff record not found"));
            targetDeptId = staff.getDepartment().getId();
        }

        DashboardMetricsResponse.DashboardMetricsResponseBuilder builder = DashboardMetricsResponse.builder();
        final Integer finalDeptId = targetDeptId;

        // 1. Common Organizational Metrics
        long activeStaff = staffRepository.findByOrganizationId(orgId).stream()
                .filter(s -> finalDeptId == null || s.getDepartment().getId().equals(finalDeptId))
                .filter(com.shiftshield.entity.Staff::getIsActive).count();
        long totalStaff = staffRepository.findByOrganizationId(orgId).stream()
                .filter(s -> finalDeptId == null || s.getDepartment().getId().equals(finalDeptId)).count();
        builder.totalActiveStaff(activeStaff);
        builder.totalInactiveStaff(totalStaff - activeStaff);
        
        if (targetDeptId == null) {
            builder.totalDepartments((long) departmentRepository.findByOrganizationId(orgId).size());
        } else {
            builder.totalDepartments(1L);
            builder.departmentId(targetDeptId);
        }

        // Unread Notifications for current user
        long unreadNotifs = notificationRepository.findByUserIdAndReadStatusFalseOrderByCreatedAtDesc(currentUser.getId()).size();
        builder.unreadNotifications(unreadNotifs);

        // 2. Role-specific aggregations
        if (role.equals("STAFF")) {
            // Staff see their own shifts
            List<com.shiftshield.dto.ShiftAssignmentResponse> myAssignments = shiftService.getMyAssignments();
            builder.myUpcomingShifts(myAssignments);
            builder.weeklyHours((long) (myAssignments.size() * 8)); // Estimate
            builder.pendingRequests(0L); // Placeholder for request system
        } else {
            long openShifts = shiftRepository.findByOrganizationId(orgId).stream()
                    .filter(s -> finalDeptId == null || s.getDepartment().getId().equals(finalDeptId))
                    .filter(s -> s.getStatus().equals("OPEN")).count();
            long partialShifts = shiftRepository.findByOrganizationId(orgId).stream()
                    .filter(s -> finalDeptId == null || s.getDepartment().getId().equals(finalDeptId))
                    .filter(s -> s.getStatus().equals("PARTIAL")).count();
            long filledShifts = shiftRepository.findByOrganizationId(orgId).stream()
                    .filter(s -> finalDeptId == null || s.getDepartment().getId().equals(finalDeptId))
                    .filter(s -> s.getStatus().equals("FILLED")).count();
            
            builder.totalOpenShifts(openShifts + partialShifts);
            builder.totalFilledShifts(filledShifts);
            builder.understaffedShifts(openShifts + partialShifts);
        }

        // 3. Risk Metrics (for higher roles)
        if (!role.equals("STAFF")) {
            long criticalRisk = riskAssessmentRepository.findByOrganizationId(orgId).stream()
                    .filter(r -> r.getRiskLevel().equals("CRITICAL")).count();
            long highRisk = riskAssessmentRepository.findByOrganizationId(orgId).stream()
                    .filter(r -> r.getRiskLevel().equals("HIGH")).count();
            
            builder.criticalRiskShifts(criticalRisk);
            builder.highRiskShifts(highRisk);
            
            // Limit recent risks to 5
            builder.recentRisks(riskService.getRecentAssessments().stream().limit(5).collect(Collectors.toList()));
        }

        // 4. Recent / Upcoming shifts for Supervisors/Managers
        if (!role.equals("STAFF")) {
            List<ShiftResponse> upcoming = shiftService.getAllShifts(null, null, null).stream()
                    .filter(s -> s.getStatus().equals("OPEN") || s.getStatus().equals("PARTIAL"))
                    .limit(5)
                    .collect(Collectors.toList());
            builder.upcomingShifts(upcoming);
        }

        return builder.build();
    }
}
