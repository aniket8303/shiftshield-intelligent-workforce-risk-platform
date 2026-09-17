package com.shiftshield.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "workload_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkloadRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = true)
    private Shift shift;

    // e.g., LOW, MEDIUM, HIGH, CRITICAL
    @Column(name = "workload_level", nullable = false)
    private String workloadLevel;

    @Column(name = "hours_worked", nullable = false)
    private Integer hoursWorked;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

}
