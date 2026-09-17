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

    public RiskCalculationResult calculate(Shift shift, List<ShiftAssignment> assignments, List<RiskRule> rules, Map<Integer, List<WorkloadRecord>> workloadMap) {
        Map<String, Double> ruleMap = rules.stream()
                .collect(Collectors.toMap(RiskRule::getRuleName, RiskRule::getThresholdValue));

        int riskScore = 0;
        List<RiskReason> reasons = new ArrayList<>();
        List<String> rawReasons = new ArrayList<>();

        // 1. Staffing Deficit
        double minStaffRatio = ruleMap.getOrDefault("MIN_STAFF_RATIO", 1.0);
        if (shift.getRequiredStaffCount() > 0) {
            double currentRatio = (double) assignments.size() / shift.getRequiredStaffCount();
            if (currentRatio < minStaffRatio) {
                int score = currentRatio < 0.8 ? 40 : 20;
                riskScore += score;
                String desc = currentRatio < 0.8 ? "Critical Staffing Deficit: Only " + (currentRatio * 100) + "% staffed." : "Minor Staffing Deficit: Not 100% staffed.";
                reasons.add(new RiskReason(desc, "STAFFING", score));
                rawReasons.add(desc);
            }
        }

        // 2. Senior Coverage Deficit
        double minSeniorRatio = ruleMap.getOrDefault("MIN_SENIOR_RATIO", 0.25);
        if (shift.getRequiredSeniorStaffCount() > 0) {
            long seniorCount = assignments.stream()
                    .filter(a -> a.getStaff().getExperienceLevel() != null && a.getStaff().getExperienceLevel() >= 5)
                    .count();
            
            double seniorRatio = assignments.isEmpty() ? 0 : (double) seniorCount / assignments.size();
            if (seniorRatio < minSeniorRatio) {
                riskScore += 30;
                String desc = "Experience Deficit: Senior staff ratio is below required minimum.";
                reasons.add(new RiskReason(desc, "EXPERIENCE", 30));
                rawReasons.add(desc);
            }
        }

        // 3. Workload & Rest Check
        for (ShiftAssignment assignment : assignments) {
            Staff staff = assignment.getStaff();
            List<WorkloadRecord> wRecords = workloadMap.getOrDefault(staff.getId(), new ArrayList<>());
            
            boolean highlyFatigued = wRecords.stream().anyMatch(w -> "HIGH".equals(w.getWorkloadLevel()) || "CRITICAL".equals(w.getWorkloadLevel()));
            if (highlyFatigued) {
                riskScore += 15;
                String desc = "Fatigue Warning: " + staff.getUser().getFirstName() + " has recent HIGH workload.";
                reasons.add(new RiskReason(desc, "FATIGUE", 15));
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

        String recommendedAction = riskScore >= 70 ? "IMMEDIATE REASSIGNMENT REQUIRED" : (riskScore >= 40 ? "MONITOR CLOSELY" : "NO ACTION REQUIRED");

        return new RiskCalculationResult(riskScore, riskLevel, reasons, rawReasons, recommendedAction);
    }
}
