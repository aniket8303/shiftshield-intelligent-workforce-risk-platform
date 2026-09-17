package com.shiftshield.repository;

import com.shiftshield.entity.RiskRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskRuleRepository extends JpaRepository<RiskRule, Integer> {
    List<RiskRule> findByOrganizationId(Integer organizationId);
    List<RiskRule> findByOrganizationIdAndEnabledTrue(Integer organizationId);
}
