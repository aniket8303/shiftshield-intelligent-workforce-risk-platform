package com.shiftshield.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shifts", indexes = {
    @Index(name = "idx_shift_dept", columnList = "department_id"),
    @Index(name = "idx_shift_start", columnList = "start_time"),
    @Index(name = "idx_shift_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private String type; // e.g., "Morning", "Afternoon", "Night"

    @Column(name = "required_staff_count", nullable = false)
    private Integer requiredStaffCount;

    @Builder.Default
    @Column(name = "required_senior_staff_count")
    private Integer requiredSeniorStaffCount = 0;

    @Builder.Default
    @Column(name = "assigned_staff_count")
    private Integer assignedStaffCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED, OPEN, PARTIAL, FILLED
}
