package com.shiftshield.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "simulation_scenarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulationScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "simulated_risk_score")
    private Integer simulatedRiskScore;

    @Column(name = "simulated_risk_level")
    private String simulatedRiskLevel;

    @Column(name = "is_applied")
    private Boolean isApplied = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "simulationScenario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScenarioChange> changes;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
