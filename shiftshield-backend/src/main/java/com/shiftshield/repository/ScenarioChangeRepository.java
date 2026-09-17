package com.shiftshield.repository;

import com.shiftshield.entity.ScenarioChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScenarioChangeRepository extends JpaRepository<ScenarioChange, Long> {
    List<ScenarioChange> findBySimulationScenarioId(Long scenarioId);
}
