package com.shiftshield.controller;

import com.shiftshield.entity.RiskRule;
import com.shiftshield.repository.RiskRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/risk-rules")
@PreAuthorize("hasRole('SYSTEM_ADMIN')")
public class RiskRuleController {

    @Autowired
    private RiskRuleRepository riskRuleRepository;

    @GetMapping
    public ResponseEntity<List<RiskRule>> getAllRiskRules() {
        return ResponseEntity.ok(riskRuleRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createRiskRule(@RequestBody RiskRule riskRule) {
        if (riskRule.getThresholdValue() == null || riskRule.getThresholdValue() < 0) {
            return ResponseEntity.badRequest().body("Threshold value must be valid and non-negative.");
        }
        return ResponseEntity.ok(riskRuleRepository.save(riskRule));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRiskRule(@PathVariable Integer id, @RequestBody RiskRule updatedRule) {
        Optional<RiskRule> existing = riskRuleRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (updatedRule.getThresholdValue() == null || updatedRule.getThresholdValue() < 0) {
            return ResponseEntity.badRequest().body("Threshold value must be valid and non-negative.");
        }
        RiskRule rule = existing.get();
        rule.setRuleName(updatedRule.getRuleName());
        rule.setThresholdValue(updatedRule.getThresholdValue());
        rule.setEnabled(updatedRule.getEnabled());
        rule.setDescription(updatedRule.getDescription());
        if(updatedRule.getOrganization() != null) {
            rule.setOrganization(updatedRule.getOrganization());
        }

        return ResponseEntity.ok(riskRuleRepository.save(rule));
    }
}
