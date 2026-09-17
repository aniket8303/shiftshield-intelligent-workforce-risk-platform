package com.shiftshield.risk;

import com.shiftshield.entity.RiskRule;
import com.shiftshield.entity.Shift;
import com.shiftshield.entity.ShiftAssignment;
import com.shiftshield.entity.Staff;
import com.shiftshield.entity.WorkloadRecord;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class RiskCalculator {

    public RiskCalculationResult calculate(Shift shift, List<ShiftAssignment> assignments, List<RiskRule> rules,
            Map<Integer, List<WorkloadRecord>> workloadMap) {
        Map<String, Double> ruleMap = rules.stream()
                .collect(Collectors.toMap(RiskRule::getRuleName, RiskRule::getThresholdValue));

        int riskScore = 0;
        List<RiskReason> reasons = new ArrayList<>();
        List<String> rawReasons = new ArrayList<>();

        // 1. Staffing Deficit
        double minStaffRatio = ruleMap.getOrDefault("MINIMUM_STAFFING_RATIO", 1.0); // e.g., 1.0 means 100%
        int minStaffing = ruleMap.getOrDefault("MINIMUM_STAFFING", (double) shift.getRequiredStaffCount()).intValue();
        
        int requiredStaff = Math.max(shift.getRequiredStaffCount(), minStaffing);

        if (requiredStaff > 0) {
            double currentRatio = (double) assignments.size() / requiredStaff;
            if (currentRatio < minStaffRatio) {
                int score = currentRatio < 0.8 ? 40 : 20;
                riskScore += score;
                String desc = currentRatio < 0.8
                        ? "Critical Staffing Deficit: Only " + String.format("%.0f", currentRatio * 100) + "% staffed. Assigned " + assignments.size() + ", Required " + requiredStaff + "."
                        : "Minor Staffing Deficit: Assigned " + assignments.size() + ", Required " + requiredStaff + ".";
                reasons.add(new RiskReason(desc, "STAFFING", score));
                rawReasons.add(desc);
            }
        }

        // 2. Senior Coverage Deficit
        int minSeniorStaff = ruleMap.getOrDefault("MINIMUM_SENIOR_STAFF", (double) shift.getRequiredSeniorStaffCount()).intValue();
        int requiredSenior = Math.max(shift.getRequiredSeniorStaffCount(), minSeniorStaff);

        if (requiredSenior > 0) {

            long seniorCount = assignments.stream()
                    .filter(a -> !"CANCELLED".equalsIgnoreCase(a.getStatus()))
                    .filter(a -> a.getStaff().getExperienceLevel() != null
                            && a.getStaff().getExperienceLevel() >= 5)
                    .count();

            if (seniorCount < requiredSenior) {

                int seniorDeficit = requiredSenior - (int) seniorCount;
                int score = seniorDeficit >= 2 ? 30 : 15;

                String desc = "Experience Deficit: "
                        + seniorCount + " senior staff assigned, "
                        + requiredSenior + " required.";

                riskScore += score;
                reasons.add(new RiskReason(desc, "EXPERIENCE", score));
                rawReasons.add(desc);
            }
        }

        // 3. Workload & Rest Check
        double maxWeeklyHours = ruleMap.getOrDefault("MAXIMUM_WEEKLY_HOURS", 48.0);
        double highWorkloadThreshold = ruleMap.getOrDefault("HIGH_WORKLOAD_THRESHOLD", 75.0);

        for (ShiftAssignment assignment : assignments) {
            Staff staff = assignment.getStaff();
            List<WorkloadRecord> wRecords = workloadMap.getOrDefault(staff.getId(), new ArrayList<>());

            int totalHoursWorked = wRecords.stream().mapToInt(w -> w.getHoursWorked() != null ? w.getHoursWorked() : 0).sum();

            boolean highlyFatigued = wRecords.stream()
                    .anyMatch(w -> "HIGH".equals(w.getWorkloadLevel()) || "CRITICAL".equals(w.getWorkloadLevel()));
                    
            if (highlyFatigued || totalHoursWorked >= highWorkloadThreshold) {
                riskScore += 20;
                String desc = "Fatigue Warning: " + staff.getUser().getFirstName() + " has exceeded High Workload Threshold (" + totalHoursWorked + " hrs vs " + String.format("%.0f", highWorkloadThreshold) + " hrs limit).";
                reasons.add(new RiskReason(desc, "FATIGUE", 20));
                rawReasons.add(desc);
            } else if (totalHoursWorked > maxWeeklyHours) {
                riskScore += 10;
                String desc = "Workload Warning: " + staff.getUser().getFirstName() + " has exceeded Maximum Weekly Hours (" + totalHoursWorked + " hrs vs " + String.format("%.0f", maxWeeklyHours) + " hrs limit).";
                reasons.add(new RiskReason(desc, "FATIGUE", 10));
                rawReasons.add(desc);
            }
        }

        String riskLevel;
        if (riskScore >= 70) {
            riskLevel = "CRITICAL";
        } else if (riskScore >= 40) {
            riskLevel = "HIGH";
        } else if (riskScore >= 20) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        String recommendedAction = riskScore >= 70 ? "IMMEDIATE REASSIGNMENT REQUIRED"
                : (riskScore >= 40 ? "MONITOR CLOSELY" : "NO ACTION REQUIRED");

        return new RiskCalculationResult(riskScore, riskLevel, reasons, rawReasons, recommendedAction);
    }
}
