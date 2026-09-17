package com.shiftshield.repository;

import com.shiftshield.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Integer> {
    List<RiskAssessment> findByOrganizationId(Integer organizationId);
    Optional<RiskAssessment> findByShiftId(Integer shiftId);
}