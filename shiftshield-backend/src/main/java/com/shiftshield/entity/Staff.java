package com.shiftshield.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff", indexes = {
    @Index(name = "idx_staff_org", columnList = "organization_id"),
    @Index(name = "idx_staff_dept", columnList = "department_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Links staff details to auth/user info

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false)
    private String designation; // e.g., Senior Nurse, Junior Nurse, Surgeon

    @Column(name = "employee_id", unique = true)
    private String employeeId;

    @Column(name = "employment_status")
    private String employmentStatus; // e.g., FULL_TIME, PART_TIME, CONTRACT

    @Column(name = "experience_level")
    private Integer experienceLevel; // years of experience or tier

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
