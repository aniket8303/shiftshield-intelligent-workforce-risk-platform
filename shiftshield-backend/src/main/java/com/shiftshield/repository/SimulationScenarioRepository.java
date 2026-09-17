package com.shiftshield.repository;

import com.shiftshield.entity.SimulationScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulationScenarioRepository extends JpaRepository<SimulationScenario, Long> {
    List<SimulationScenario> findByOrganizationId(Integer organizationId);
    List<SimulationScenario> findByShiftId(Integer shiftId);
}
