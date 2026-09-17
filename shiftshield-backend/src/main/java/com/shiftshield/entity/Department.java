package com.shiftshield.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "head_user_id")
    private User headUser; // The department head (e.g. Head of Cardiology)

    @Column(nullable = false, unique = true)
    private String code;

    @Column(length = 500)
    private String description;

    @Builder.Default
    @Column(name = "required_staffing")
    private Integer requiredStaffing = 0;

    @Builder.Default
    @Column(name = "required_senior_staff")
    private Integer requiredSeniorStaff = 0;

    @Builder.Default
    @Column(name = "risk_level")
    private String riskLevel = "LOW";

    @Builder.Default
    @Column(nullable = false)
    private String status = "ACTIVE";
}
