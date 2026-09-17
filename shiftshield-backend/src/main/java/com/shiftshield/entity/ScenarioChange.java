package com.shiftshield.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "scenario_changes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScenarioChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_scenario_id", nullable = false)
    private SimulationScenario simulationScenario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    // ADD or REMOVE
    @Column(name = "action", nullable = false)
    private String action;

}
