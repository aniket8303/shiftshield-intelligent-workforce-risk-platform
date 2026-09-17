package com.shiftshield.controller;

import com.shiftshield.entity.RiskRule;
import com.shiftshield.repository.RiskRuleRepository;
import com.shiftshield.service.AuditLogService;
import com.shiftshield.entity.Organization;
import com.shiftshield.repository.OrganizationRepository;
import com.shiftshield.security.SecurityUtils;
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
    
    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private SecurityUtils securityUtils;
    
    @Autowired
    private OrganizationRepository organizationRepository;

    @GetMapping
    public ResponseEntity<List<RiskRule>> getAllRiskRules() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        return ResponseEntity.ok(riskRuleRepository.findByOrganizationId(orgId));
    }

    @PostMapping
    public ResponseEntity<?> createRiskRule(@RequestBody RiskRule riskRule) {
        if (riskRule.getThresholdValue() == null || riskRule.getThresholdValue() < 0) {
            return ResponseEntity.badRequest().body("Threshold value must be valid and non-negative.");
        }
        
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Organization org = organizationRepository.findById(orgId).orElseThrow(() -> new RuntimeException("Org not found"));
        riskRule.setOrganization(org);
        
        RiskRule saved = riskRuleRepository.save(riskRule);
        auditLogService.logAction("CREATE_RISK_RULE", "RiskRule", saved.getId(), "Created risk rule: " + saved.getRuleName() + " with threshold " + saved.getThresholdValue());
        return ResponseEntity.ok(saved);
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
        
        Integer orgId = securityUtils.getCurrentOrganizationId();
        if (!rule.getOrganization().getId().equals(orgId)) {
            return ResponseEntity.status(403).body("Unauthorized to update this risk rule.");
        }

        RiskRule saved = riskRuleRepository.save(rule);
        auditLogService.logAction("UPDATE_RISK_RULE", "RiskRule", saved.getId(), "Updated risk rule: " + saved.getRuleName() + " to threshold " + saved.getThresholdValue());

        return ResponseEntity.ok(saved);
    }
}
