package com.shiftshield.risk;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shiftshield.entity.RiskAssessment;
import com.shiftshield.entity.RiskRule;
import com.shiftshield.entity.Shift;
import com.shiftshield.entity.ShiftAssignment;
import com.shiftshield.entity.WorkloadRecord;
import com.shiftshield.repository.RiskRuleRepository;
import com.shiftshield.repository.WorkloadRecordRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RiskEngine {

    private final RiskCalculator riskCalculator;
    private final RiskRuleRepository riskRuleRepository;
    private final WorkloadRecordRepository workloadRecordRepository;
    private final SecurityUtils securityUtils;
    private final ObjectMapper objectMapper;

    public RiskEngine(RiskCalculator riskCalculator, 
                      RiskRuleRepository riskRuleRepository, 
                      WorkloadRecordRepository workloadRecordRepository, 
                      SecurityUtils securityUtils,
                      ObjectMapper objectMapper) {
        this.riskCalculator = riskCalculator;
        this.riskRuleRepository = riskRuleRepository;
        this.workloadRecordRepository = workloadRecordRepository;
        this.securityUtils = securityUtils;
        this.objectMapper = objectMapper;
    }

    public RiskAssessment evaluateShiftRisk(Shift shift, List<ShiftAssignment> assignments) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        List<RiskRule> rules = riskRuleRepository.findByOrganizationIdAndEnabledTrue(orgId);

        Map<Integer, List<WorkloadRecord>> workloadMap = new HashMap<>();
        for (ShiftAssignment assignment : assignments) {
            Integer staffId = assignment.getStaff().getId();
            if (!workloadMap.containsKey(staffId)) {
                workloadMap.put(staffId, workloadRecordRepository.findByStaffId(staffId));
            }
        }

        RiskCalculationResult result = riskCalculator.calculate(shift, assignments, rules, workloadMap);

        String reasonsJson;
        try {
            reasonsJson = objectMapper.writeValueAsString(result.getRawReasons());
        } catch (JsonProcessingException e) {
            reasonsJson = "[]";
        }

        return RiskAssessment.builder()
                .organization(shift.getOrganization())
                .shift(shift)
                .riskScore(result.getRiskScore())
                .riskLevel(result.getRiskLevel())
                .reasons(reasonsJson)
                .build();
    }
}
