package com.shiftshield.service;

import com.shiftshield.dto.StaffRequest;
import com.shiftshield.dto.StaffResponse;
import com.shiftshield.entity.Department;
import com.shiftshield.entity.Organization;
import com.shiftshield.entity.Staff;
import com.shiftshield.entity.User;
import com.shiftshield.repository.DepartmentRepository;
import com.shiftshield.repository.StaffRepository;
import com.shiftshield.repository.UserRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final SecurityUtils securityUtils;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public StaffService(StaffRepository staffRepository,
                        UserRepository userRepository,
                        DepartmentRepository departmentRepository,
                        SecurityUtils securityUtils,
                        PasswordEncoder passwordEncoder,
                        AuditLogService auditLogService) {
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.securityUtils = securityUtils;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    public List<StaffResponse> getAllStaff() {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        return staffRepository.findByOrganizationId(orgId)
                .stream()
                .filter(staff -> "STAFF".equals(staff.getUser().getRole()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<StaffResponse> getStaffByDepartment(Integer departmentId) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        return staffRepository.findByOrganizationIdAndDepartmentId(orgId, departmentId)
                .stream()
                .filter(staff -> "STAFF".equals(staff.getUser().getRole()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public StaffResponse getStaffById(Integer id) {
        return mapToResponse(getStaffEntityById(id));
    }

    @Transactional
    public StaffResponse createStaff(StaffRequest request) {
        User currentUser = securityUtils.getCurrentUser();
        Organization org = currentUser.getOrganization();

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        if (!dept.getOrganization().getId().equals(org.getId())) {
            throw new RuntimeException("Invalid department");
        }

        // Create User
        User newUser = User.builder()
                .organization(org)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "default123"))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole())
                .status(request.getIsActive() != null && request.getIsActive() ? "ACTIVE" : "INACTIVE")
                .build();
        newUser = userRepository.save(newUser);

        // Create Staff
        Staff newStaff = Staff.builder()
                .user(newUser)
                .organization(org)
                .department(dept)
                .designation(request.getDesignation())
                .employeeId(request.getEmployeeId())
                .employmentStatus(request.getEmploymentStatus())
                .experienceLevel(request.getExperienceLevel())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        newStaff = staffRepository.save(newStaff);

        auditLogService.logAction("CREATE_STAFF", "Staff", newStaff.getId(), "Created staff member: " + newStaff.getUser().getFirstName() + " " + newStaff.getUser().getLastName());

        return mapToResponse(newStaff);
    }

    @Transactional
    public StaffResponse updateStaff(Integer id, StaffRequest request) {
        Staff staff = getStaffEntityById(id);
        User user = staff.getUser();
        
        if (!user.getEmail().equals(request.getEmail()) && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        if (!dept.getOrganization().getId().equals(staff.getOrganization().getId())) {
            throw new RuntimeException("Invalid department");
        }

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        userRepository.save(user);

        staff.setDepartment(dept);
        staff.setDesignation(request.getDesignation());
        staff.setEmployeeId(request.getEmployeeId());
        staff.setEmploymentStatus(request.getEmploymentStatus());
        staff.setExperienceLevel(request.getExperienceLevel());
        staff.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        
        Staff updatedStaff = staffRepository.save(staff);
        
        auditLogService.logAction("UPDATE_STAFF", "Staff", updatedStaff.getId(), "Updated staff member: " + user.getFirstName() + " " + user.getLastName());
        
        return mapToResponse(updatedStaff);
    }

    public void deleteStaff(Integer id) {
        Staff staff = getStaffEntityById(id);
        User user = staff.getUser();
        staff.setIsActive(false);
        user.setStatus("INACTIVE");
        staffRepository.save(staff);
        userRepository.save(user);
        
        auditLogService.logAction("DEACTIVATE_STAFF", "Staff", staff.getId(), "Deactivated staff member: " + user.getFirstName() + " " + user.getLastName());
    }

    private Staff getStaffEntityById(Integer id) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        if (!staff.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Unauthorized access to staff record");
        }
        return staff;
    }

    private StaffResponse mapToResponse(Staff staff) {
        User user = staff.getUser();
        return StaffResponse.builder()
                .id(staff.getId())
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .employeeId(staff.getEmployeeId())
                .employmentStatus(staff.getEmploymentStatus())
                .role(user.getRole())
                .departmentId(staff.getDepartment().getId())
                .departmentName(staff.getDepartment().getName())
                .designation(staff.getDesignation())
                .experienceLevel(staff.getExperienceLevel())
                .isActive(staff.getIsActive())
                .build();
    }
}
