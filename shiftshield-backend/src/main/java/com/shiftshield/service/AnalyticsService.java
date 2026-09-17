package com.shiftshield.service;

import com.shiftshield.dto.AnalyticsResponse;
import com.shiftshield.dto.AnalyticsTrendResponse;
import com.shiftshield.dto.AnalyticsStaffingResponse;
import com.shiftshield.dto.AnalyticsDepartmentResponse;
import com.shiftshield.dto.DashboardSummaryDTO;
import com.shiftshield.entity.RiskAssessment;
import com.shiftshield.entity.Shift;
import com.shiftshield.repository.RiskAssessmentRepository;
import com.shiftshield.repository.ShiftRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ShiftRepository shiftRepository;
    private final RiskAssessmentRepository riskAssessmentRepository;
    private final SecurityUtils securityUtils;

    public AnalyticsService(ShiftRepository shiftRepository,
                            RiskAssessmentRepository riskAssessmentRepository,
                            SecurityUtils securityUtils) {
        this.shiftRepository = shiftRepository;
        this.riskAssessmentRepository = riskAssessmentRepository;
        this.securityUtils = securityUtils;
    }

    public AnalyticsResponse getOrganizationAnalytics() {
        Integer orgId = securityUtils.getCurrentOrganizationId();

        List<Shift> shifts = shiftRepository.findByOrganizationId(orgId);
        List<RiskAssessment> risks = riskAssessmentRepository.findByOrganizationId(orgId);

        // 1. Critical Risks By Department
        Map<String, Long> criticalRisksByDept = risks.stream()
                .filter(r -> "CRITICAL".equals(r.getRiskLevel()))
                .collect(Collectors.groupingBy(
                        r -> r.getShift().getDepartment().getName(),
                        Collectors.counting()
                ));

        // 2. Shift Status Distribution
        Map<String, Long> statusDistribution = shifts.stream()
                .collect(Collectors.groupingBy(
                        Shift::getStatus,
                        Collectors.counting()
                ));

        // 3. Average Staff Per Shift
        double averageStaff = shifts.isEmpty() ? 0.0 :
                shifts.stream()
                        .mapToInt(Shift::getAssignedStaffCount)
                        .average()
                        .orElse(0.0);

        return AnalyticsResponse.builder()
                .criticalRisksByDepartment(criticalRisksByDept)
                .shiftStatusDistribution(statusDistribution)
                .averageStaffPerShift(averageStaff)
                .build();
    }

    public DashboardSummaryDTO getDashboardSummary() {
        Integer orgId = securityUtils.getCurrentOrganizationId();

        List<Shift> shifts = shiftRepository.findByOrganizationId(orgId);
        List<RiskAssessment> risks = riskAssessmentRepository.findByOrganizationId(orgId);

        // 1. Overview
        Map<String, Long> criticalRisksByDept = risks.stream()
                .filter(r -> "CRITICAL".equals(r.getRiskLevel()))
                .collect(Collectors.groupingBy(
                        r -> r.getShift().getDepartment().getName(),
                        Collectors.counting()
                ));
        Map<String, Long> statusDistribution = shifts.stream()
                .collect(Collectors.groupingBy(
                        Shift::getStatus,
                        Collectors.counting()
                ));
        double averageStaff = shifts.isEmpty() ? 0.0 :
                shifts.stream()
                        .mapToInt(Shift::getAssignedStaffCount)
                        .average()
                        .orElse(0.0);
        AnalyticsResponse overview = AnalyticsResponse.builder()
                .criticalRisksByDepartment(criticalRisksByDept)
                .shiftStatusDistribution(statusDistribution)
                .averageStaffPerShift(averageStaff)
                .build();

        // 2. Risk Trends
        Map<java.time.LocalDate, List<RiskAssessment>> risksByDate = risks.stream()
                .filter(r -> r.getCalculatedAt() != null)
                .collect(Collectors.groupingBy(r -> r.getCalculatedAt().toLocalDate()));
        List<AnalyticsTrendResponse> riskTrends = risksByDate.entrySet().stream()
                .map(entry -> {
                    List<RiskAssessment> dailyRisks = entry.getValue();
                    double avgRisk = dailyRisks.stream().mapToInt(RiskAssessment::getRiskScore).average().orElse(0.0);
                    int critical = (int) dailyRisks.stream().filter(r -> "CRITICAL".equals(r.getRiskLevel())).count();
                    int high = (int) dailyRisks.stream().filter(r -> "HIGH".equals(r.getRiskLevel())).count();
                    
                    return AnalyticsTrendResponse.builder()
                            .date(entry.getKey())
                            .averageRiskScore(avgRisk)
                            .criticalRisks(critical)
                            .highRisks(high)
                            .build();
                })
                .sorted(java.util.Comparator.comparing(AnalyticsTrendResponse::getDate))
                .collect(Collectors.toList());

        // 3. Staffing
        Map<String, List<Shift>> shiftsByDept = shifts.stream()
                .collect(Collectors.groupingBy(s -> s.getDepartment().getName()));
        List<AnalyticsStaffingResponse> staffing = shiftsByDept.entrySet().stream()
                .map(entry -> {
                    String deptName = entry.getKey();
                    List<Shift> deptShifts = entry.getValue();
                    
                    int required = deptShifts.stream().mapToInt(Shift::getRequiredStaffCount).sum();
                    int assigned = deptShifts.stream().mapToInt(Shift::getAssignedStaffCount).sum();
                    double coverage = required == 0 ? 100.0 : ((double) assigned / required) * 100.0;
                    
                    return AnalyticsStaffingResponse.builder()
                            .departmentName(deptName)
                            .requiredStaff(required)
                            .assignedStaff(assigned)
                            .coveragePercentage(Math.round(coverage * 10.0) / 10.0)
                            .build();
                })
                .collect(Collectors.toList());

        // 4. Departments
        Map<String, List<RiskAssessment>> risksByDept = risks.stream()
                .collect(Collectors.groupingBy(r -> r.getShift().getDepartment().getName()));
        List<AnalyticsDepartmentResponse> depts = risksByDept.entrySet().stream()
                .map(entry -> {
                    String deptName = entry.getKey();
                    List<RiskAssessment> deptRisks = entry.getValue();
                    
                    int critical = (int) deptRisks.stream().filter(r -> "CRITICAL".equals(r.getRiskLevel())).count();
                    int high = (int) deptRisks.stream().filter(r -> "HIGH".equals(r.getRiskLevel())).count();
                    int medium = (int) deptRisks.stream().filter(r -> "MEDIUM".equals(r.getRiskLevel())).count();
                    int low = (int) deptRisks.stream().filter(r -> "LOW".equals(r.getRiskLevel())).count();
                    
                    return AnalyticsDepartmentResponse.builder()
                            .departmentName(deptName)
                            .openRisks(deptRisks.size())
                            .criticalRisks(critical)
                            .highRisks(high)
                            .mediumRisks(medium)
                            .lowRisks(low)
                            .build();
                })
                .collect(Collectors.toList());

        return DashboardSummaryDTO.builder()
                .overview(overview)
                .riskTrends(riskTrends)
                .staffing(staffing)
                .departments(depts)
                .build();
    }
    public List<AnalyticsTrendResponse> getRiskTrends() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        List<RiskAssessment> risks = riskAssessmentRepository.findByOrganizationId(orgId);
        
        // Group by Date (calculatedAt.toLocalDate())
        Map<java.time.LocalDate, List<RiskAssessment>> risksByDate = risks.stream()
                .filter(r -> r.getCalculatedAt() != null)
                .collect(Collectors.groupingBy(r -> r.getCalculatedAt().toLocalDate()));
                
        return risksByDate.entrySet().stream()
                .map(entry -> {
                    List<RiskAssessment> dailyRisks = entry.getValue();
                    double avgRisk = dailyRisks.stream().mapToInt(RiskAssessment::getRiskScore).average().orElse(0.0);
                    int critical = (int) dailyRisks.stream().filter(r -> "CRITICAL".equals(r.getRiskLevel())).count();
                    int high = (int) dailyRisks.stream().filter(r -> "HIGH".equals(r.getRiskLevel())).count();
                    
                    return AnalyticsTrendResponse.builder()
                            .date(entry.getKey())
                            .averageRiskScore(avgRisk)
                            .criticalRisks(critical)
                            .highRisks(high)
                            .build();
                })
                .sorted(java.util.Comparator.comparing(AnalyticsTrendResponse::getDate))
                .collect(Collectors.toList());
    }

    public List<AnalyticsStaffingResponse> getStaffingAnalytics() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        List<Shift> shifts = shiftRepository.findByOrganizationId(orgId);
        
        Map<String, List<Shift>> shiftsByDept = shifts.stream()
                .collect(Collectors.groupingBy(s -> s.getDepartment().getName()));
                
        return shiftsByDept.entrySet().stream()
                .map(entry -> {
                    String deptName = entry.getKey();
                    List<Shift> deptShifts = entry.getValue();
                    
                    int required = deptShifts.stream().mapToInt(Shift::getRequiredStaffCount).sum();
                    int assigned = deptShifts.stream().mapToInt(Shift::getAssignedStaffCount).sum();
                    double coverage = required == 0 ? 100.0 : ((double) assigned / required) * 100.0;
                    
                    return AnalyticsStaffingResponse.builder()
                            .departmentName(deptName)
                            .requiredStaff(required)
                            .assignedStaff(assigned)
                            .coveragePercentage(Math.round(coverage * 10.0) / 10.0)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<AnalyticsDepartmentResponse> getDepartmentAnalytics() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        List<RiskAssessment> risks = riskAssessmentRepository.findByOrganizationId(orgId);
        
        Map<String, List<RiskAssessment>> risksByDept = risks.stream()
                .collect(Collectors.groupingBy(r -> r.getShift().getDepartment().getName()));
                
        return risksByDept.entrySet().stream()
                .map(entry -> {
                    String deptName = entry.getKey();
                    List<RiskAssessment> deptRisks = entry.getValue();
                    
                    int critical = (int) deptRisks.stream().filter(r -> "CRITICAL".equals(r.getRiskLevel())).count();
                    int high = (int) deptRisks.stream().filter(r -> "HIGH".equals(r.getRiskLevel())).count();
                    int medium = (int) deptRisks.stream().filter(r -> "MEDIUM".equals(r.getRiskLevel())).count();
                    int low = (int) deptRisks.stream().filter(r -> "LOW".equals(r.getRiskLevel())).count();
                    
                    return AnalyticsDepartmentResponse.builder()
                            .departmentName(deptName)
                            .openRisks(deptRisks.size())
                            .criticalRisks(critical)
                            .highRisks(high)
                            .mediumRisks(medium)
                            .lowRisks(low)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
