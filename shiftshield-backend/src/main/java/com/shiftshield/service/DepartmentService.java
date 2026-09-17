package com.shiftshield.service;

import com.shiftshield.dto.DepartmentRequest;
import com.shiftshield.dto.DepartmentResponse;
import com.shiftshield.entity.Department;
import com.shiftshield.entity.Organization;
import com.shiftshield.entity.User;
import com.shiftshield.repository.DepartmentRepository;
import com.shiftshield.repository.OrganizationRepository;
import com.shiftshield.repository.UserRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final AuditLogService auditLogService;

    public DepartmentService(DepartmentRepository departmentRepository,
                             OrganizationRepository organizationRepository,
                             UserRepository userRepository,
                             SecurityUtils securityUtils,
                             AuditLogService auditLogService) {
        this.departmentRepository = departmentRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.securityUtils = securityUtils;
        this.auditLogService = auditLogService;
    }

    public List<DepartmentResponse> getAllDepartments() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        return departmentRepository.findByOrganizationId(orgId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Integer id) {
        Department dept = getDepartmentEntityById(id);
        return mapToResponse(dept);
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        User headUser = null;
        if (request.getHeadUserId() != null) {
            headUser = userRepository.findById(request.getHeadUserId())
                    .orElseThrow(() -> new RuntimeException("Head user not found"));
            if (!headUser.getOrganization().getId().equals(orgId)) {
                throw new RuntimeException("Head user does not belong to your organization");
            }
        }

        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .requiredStaffing(request.getRequiredStaffing() != null ? request.getRequiredStaffing() : 0)
                .requiredSeniorStaff(request.getRequiredSeniorStaff() != null ? request.getRequiredSeniorStaff() : 0)
                .riskLevel(request.getRiskLevel() != null ? request.getRiskLevel() : "LOW")
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .organization(org)
                .headUser(headUser)
                .build();

        Department saved = departmentRepository.save(department);
        
        auditLogService.logAction(
                "CREATE_DEPARTMENT",
                "Department",
                saved.getId(),
                "Created department: " + saved.getName()
        );
        
        return mapToResponse(saved);
    }

    public DepartmentResponse updateDepartment(Integer id, DepartmentRequest request) {
        Department dept = getDepartmentEntityById(id);
        
        dept.setName(request.getName());
        dept.setCode(request.getCode());
        dept.setDescription(request.getDescription());
        if (request.getRequiredStaffing() != null) dept.setRequiredStaffing(request.getRequiredStaffing());
        if (request.getRequiredSeniorStaff() != null) dept.setRequiredSeniorStaff(request.getRequiredSeniorStaff());
        if (request.getRiskLevel() != null) dept.setRiskLevel(request.getRiskLevel());
        if (request.getStatus() != null) dept.setStatus(request.getStatus());
        
        if (request.getHeadUserId() != null) {
            User headUser = userRepository.findById(request.getHeadUserId())
                    .orElseThrow(() -> new RuntimeException("Head user not found"));
            if (!headUser.getOrganization().getId().equals(dept.getOrganization().getId())) {
                throw new RuntimeException("Head user does not belong to your organization");
            }
            dept.setHeadUser(headUser);
        } else {
            dept.setHeadUser(null);
        }

        Department updated = departmentRepository.save(dept);

        auditLogService.logAction(
                "UPDATE_DEPARTMENT",
                "Department",
                updated.getId(),
                "Updated department: " + updated.getName()
        );

        return mapToResponse(updated);
    }

    public void deleteDepartment(Integer id) {
        Department dept = getDepartmentEntityById(id);
        departmentRepository.delete(dept);

        auditLogService.logAction(
                "DELETE_DEPARTMENT",
                "Department",
                id,
                "Deleted department: " + dept.getName()
        );
    }

    private Department getDepartmentEntityById(Integer id) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        if (!dept.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Unauthorized access to department");
        }
        return dept;
    }

    private DepartmentResponse mapToResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .requiredStaffing(dept.getRequiredStaffing())
                .requiredSeniorStaff(dept.getRequiredSeniorStaff())
                .riskLevel(dept.getRiskLevel())
                .status(dept.getStatus())
                .headUserId(dept.getHeadUser() != null ? dept.getHeadUser().getId() : null)
                .headUserName(dept.getHeadUser() != null ? dept.getHeadUser().getFirstName() + " " + dept.getHeadUser().getLastName() : null)
                .organizationId(dept.getOrganization() != null ? dept.getOrganization().getId() : null)
                .organizationName(dept.getOrganization() != null ? dept.getOrganization().getName() : null)
                .build();
    }
}
