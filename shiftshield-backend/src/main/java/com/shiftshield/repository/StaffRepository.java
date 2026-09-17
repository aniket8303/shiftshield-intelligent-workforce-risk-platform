package com.shiftshield.repository;

import com.shiftshield.entity.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    long countByOrganizationId(Integer organizationId);

    @EntityGraph(attributePaths = {"user", "department", "organization"})
    List<Staff> findByOrganizationId(Integer organizationId);

    @EntityGraph(attributePaths = {"user", "department", "organization"})
    Page<Staff> findByOrganizationId(Integer organizationId, Pageable pageable);

    @EntityGraph(attributePaths = {"user", "department", "organization"})
    List<Staff> findByOrganizationIdAndDepartmentId(Integer organizationId, Integer departmentId);

    @EntityGraph(attributePaths = {"user", "department", "organization"})
    Page<Staff> findByOrganizationIdAndDepartmentId(Integer organizationId, Integer departmentId, Pageable pageable);

    Optional<Staff> findByUserId(Integer userId);
}