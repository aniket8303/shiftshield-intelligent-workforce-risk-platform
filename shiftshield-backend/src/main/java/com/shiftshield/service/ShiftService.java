package com.shiftshield.service;

import com.shiftshield.dto.ShiftAssignmentRequest;
import com.shiftshield.dto.ShiftAssignmentResponse;
import com.shiftshield.dto.ShiftRequest;
import com.shiftshield.dto.ShiftResponse;
import com.shiftshield.entity.*;
import com.shiftshield.repository.DepartmentRepository;
import com.shiftshield.repository.ShiftAssignmentRepository;
import com.shiftshield.repository.ShiftRepository;
import com.shiftshield.repository.StaffRepository;
import com.shiftshield.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final DepartmentRepository departmentRepository;
    private final StaffRepository staffRepository;
    private final SecurityUtils securityUtils;
    private final AuditLogService auditLogService;
    private final RiskService riskService;
    private final NotificationService notificationService;

    // Minimum rest hours between consecutive shifts for a staff member
    private static final int MINIMUM_REST_HOURS = 8;

    public ShiftService(ShiftRepository shiftRepository,
                        ShiftAssignmentRepository shiftAssignmentRepository,
                        DepartmentRepository departmentRepository,
                        StaffRepository staffRepository,
                        SecurityUtils securityUtils,
                        AuditLogService auditLogService,
                        RiskService riskService,
                        NotificationService notificationService) {
        this.shiftRepository = shiftRepository;
        this.shiftAssignmentRepository = shiftAssignmentRepository;
        this.departmentRepository = departmentRepository;
        this.staffRepository = staffRepository;
        this.securityUtils = securityUtils;
        this.auditLogService = auditLogService;
        this.riskService = riskService;
        this.notificationService = notificationService;
    }

    public List<ShiftResponse> getAllShifts(Integer departmentId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        User currentUser = securityUtils.getCurrentUser();
        Integer orgId = currentUser.getOrganization().getId();
        String role = currentUser.getRole();
        
        Integer targetDeptId = departmentId;
        if (role.equals("DEPARTMENT_HEAD")) {
            Staff staff = staffRepository.findAll().stream()
                .filter(s -> s.getUser().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Department Head staff record not found"));
            // Enforce their own department
            targetDeptId = staff.getDepartment().getId();
        }

        List<Shift> shifts;
        
        if (targetDeptId != null && startDate != null && endDate != null) {
            shifts = shiftRepository.findByOrganizationIdAndDepartmentIdAndStartTimeBetween(orgId, targetDeptId, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
        } else if (targetDeptId != null) {
            shifts = shiftRepository.findByOrganizationIdAndDepartmentId(orgId, targetDeptId);
        } else if (startDate != null && endDate != null) {
            shifts = shiftRepository.findByOrganizationIdAndStartTimeBetween(orgId, startDate.atStartOfDay(), endDate.plusDays(1).atStartOfDay());
        } else {
            shifts = shiftRepository.findByOrganizationId(orgId);
        }

        return shifts.stream().map(this::mapToShiftResponse).collect(Collectors.toList());
    }

    public ShiftResponse getShiftById(Integer id) {
        return mapToShiftResponse(getShiftEntityById(id));
    }

    @Transactional
    public ShiftResponse createShift(ShiftRequest request) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Organization org = securityUtils.getCurrentUser().getOrganization();

        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().isEqual(request.getEndTime())) {
            throw new RuntimeException("Shift start time must be before end time");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        if (!dept.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Department does not belong to your organization");
        }

        Shift shift = Shift.builder()
                .organization(org)
                .department(dept)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .type(request.getType())
                .requiredStaffCount(request.getRequiredStaffCount())
                .requiredSeniorStaffCount(request.getRequiredSeniorStaffCount())
                .assignedStaffCount(0)
                .status("OPEN")
                .build();

        shift = shiftRepository.save(shift);
        
        auditLogService.logAction(
                "CREATE_SHIFT", 
                "Shift", 
                shift.getId(), 
                "Created shift for department: " + dept.getName() + ", type: " + shift.getType()
        );

        return mapToShiftResponse(shift);
    }

    @Transactional
    public ShiftAssignmentResponse assignStaffToShift(Integer shiftId, ShiftAssignmentRequest request) {
        Shift shift = getShiftEntityById(shiftId);
        
        Staff staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        if (!staff.getOrganization().getId().equals(shift.getOrganization().getId())) {
            throw new RuntimeException("Staff does not belong to the same organization");
        }

        if (!staff.getIsActive()) {
            throw new RuntimeException("Cannot assign an inactive staff member");
        }

        // Retrieve existing assignments for this staff
        List<ShiftAssignment> existingAssignments = shiftAssignmentRepository.findByStaffId(staff.getId());
        
        // Complex Validations
        for (ShiftAssignment existing : existingAssignments) {
            Shift existingShift = existing.getShift();
            
            // 1. Overlap Check
            boolean overlaps = existingShift.getStartTime().isBefore(shift.getEndTime()) 
                            && existingShift.getEndTime().isAfter(shift.getStartTime());
            if (overlaps) {
                throw new RuntimeException("Staff is already assigned to an overlapping shift (ID: " + existingShift.getId() + ")");
            }

            // 2. Minimum Rest Period Check
            long hoursBetween;
            if (existingShift.getEndTime().isBefore(shift.getStartTime())) {
                hoursBetween = Duration.between(existingShift.getEndTime(), shift.getStartTime()).toHours();
            } else {
                hoursBetween = Duration.between(shift.getEndTime(), existingShift.getStartTime()).toHours();
            }

            if (hoursBetween >= 0 && hoursBetween < MINIMUM_REST_HOURS) {
                throw new RuntimeException("Staff does not have the minimum required rest period of " + MINIMUM_REST_HOURS + " hours. Only " + hoursBetween + " hours rest.");
            }
        }

        // Add assignment
        ShiftAssignment assignment = ShiftAssignment.builder()
                .shift(shift)
                .staff(staff)
                .status("CONFIRMED")
                .build();
        
        assignment = shiftAssignmentRepository.save(assignment);
        
        // Update Shift counts
        shift.setAssignedStaffCount(shift.getAssignedStaffCount() + 1);
        if (shift.getAssignedStaffCount() >= shift.getRequiredStaffCount()) {
            shift.setStatus("FILLED");
        } else {
            shift.setStatus("PARTIAL");
        }
        shiftRepository.save(shift);

        // Recalculate Risk
        com.shiftshield.dto.RiskAssessmentResponse riskResponse = riskService.analyzeShiftRisk(shift.getId());
        
        // Notify the staff member
        com.shiftshield.entity.RiskAssessment riskEntity = new com.shiftshield.entity.RiskAssessment();
        riskEntity.setId(riskResponse.getId()); // dummy for notification if needed

        notificationService.createNotification(
                staff.getUser(), 
                null, // Passing null for risk to avoid lazy loading issues, or pass a fetched RiskAssessment if needed.
                "Your " + shift.getDepartment().getName() + " " + shift.getType() + " shift assignment has been updated.", 
                "ASSIGNMENT_UPDATED"
        );

        auditLogService.logAction(
                "APPLY_SCENARIO", 
                "SHIFT_ASSIGNMENT", 
                assignment.getId(), 
                "Applied " + shift.getDepartment().getName() + " staffing scenario. Assigned staff " + staff.getUser().getEmail() + " to shift ID: " + shift.getId()
        );

        return mapToShiftAssignmentResponse(assignment);
    }

    public List<ShiftAssignmentResponse> getShiftAssignments(Integer shiftId) {
        Shift shift = getShiftEntityById(shiftId);
        return shiftAssignmentRepository.findByShiftId(shift.getId())
                .stream()
                .map(this::mapToShiftAssignmentResponse)
                .collect(Collectors.toList());
    }

    public List<ShiftAssignmentResponse> getMyAssignments() {
        com.shiftshield.entity.User currentUser = securityUtils.getCurrentUser();
        
        Staff staff = staffRepository.findAll().stream()
                .filter(s -> s.getUser().getId().equals(currentUser.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Logged in user is not a staff member"));
                
        return shiftAssignmentRepository.findByStaffId(staff.getId())
                .stream()
                .map(this::mapToShiftAssignmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void unassignStaff(Integer shiftId, Integer assignmentId) {
        Shift shift = getShiftEntityById(shiftId);
        ShiftAssignment assignment = shiftAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        if (!assignment.getShift().getId().equals(shift.getId())) {
            throw new RuntimeException("Assignment does not belong to this shift");
        }

        shiftAssignmentRepository.delete(assignment);
        
        // Update Shift counts
        shift.setAssignedStaffCount(shift.getAssignedStaffCount() - 1);
        if (shift.getAssignedStaffCount() == 0) {
            shift.setStatus("OPEN");
        } else if (shift.getAssignedStaffCount() < shift.getRequiredStaffCount()) {
            shift.setStatus("PARTIAL");
        }
        shiftRepository.save(shift);

        auditLogService.logAction(
                "UNASSIGN_STAFF", 
                "ShiftAssignment", 
                assignmentId, 
                "Removed staff assignment for shift ID: " + shift.getId()
        );
    }

    private Shift getShiftEntityById(Integer id) {
        Integer orgId = securityUtils.getCurrentOrganizationId();
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
        if (!shift.getOrganization().getId().equals(orgId)) {
            throw new RuntimeException("Unauthorized access to shift");
        }
        return shift;
    }

    public List<com.shiftshield.dto.StaffResponse> findEligibleStaffForShift(Integer shiftId) {
        Shift shift = getShiftEntityById(shiftId);
        
        // 1. Fetch all active staff in the same department
        List<Staff> allDeptStaff = staffRepository.findByOrganizationIdAndDepartmentId(
                shift.getOrganization().getId(), 
                shift.getDepartment().getId()
        );

        // 2. Filter eligible staff
        List<Staff> eligibleStaff = allDeptStaff.stream()
                .filter(Staff::getIsActive)
                .filter(staff -> {
                    List<ShiftAssignment> assignments = shiftAssignmentRepository.findByStaffId(staff.getId());
                    
                    // Already assigned to this shift?
                    boolean alreadyAssigned = assignments.stream()
                            .anyMatch(a -> a.getShift().getId().equals(shift.getId()));
                    if (alreadyAssigned) return false;

                    // Check overlap and rest hours
                    for (ShiftAssignment existing : assignments) {
                        Shift existingShift = existing.getShift();
                        
                        // Overlap check
                        boolean overlaps = existingShift.getStartTime().isBefore(shift.getEndTime()) 
                                        && existingShift.getEndTime().isAfter(shift.getStartTime());
                        if (overlaps) return false;

                        // Rest hours check
                        long hoursBetween;
                        if (existingShift.getEndTime().isBefore(shift.getStartTime())) {
                            hoursBetween = Duration.between(existingShift.getEndTime(), shift.getStartTime()).toHours();
                        } else {
                            hoursBetween = Duration.between(shift.getEndTime(), existingShift.getStartTime()).toHours();
                        }
                        
                        if (hoursBetween >= 0 && hoursBetween < MINIMUM_REST_HOURS) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());

        // 3. Map to response
        return eligibleStaff.stream()
                .map(staff -> {
                    User user = staff.getUser();
                    return com.shiftshield.dto.StaffResponse.builder()
                            .id(staff.getId())
                            .userId(user.getId())
                            .email(user.getEmail())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .role(user.getRole())
                            .departmentId(staff.getDepartment().getId())
                            .departmentName(staff.getDepartment().getName())
                            .designation(staff.getDesignation())
                            .experienceLevel(staff.getExperienceLevel())
                            .isActive(staff.getIsActive())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private ShiftResponse mapToShiftResponse(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .organizationId(shift.getOrganization().getId())
                .departmentId(shift.getDepartment().getId())
                .departmentName(shift.getDepartment().getName())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .type(shift.getType())
                .requiredStaffCount(shift.getRequiredStaffCount())
                .requiredSeniorStaffCount(shift.getRequiredSeniorStaffCount())
                .assignedStaffCount(shift.getAssignedStaffCount())
                .status(shift.getStatus())
                .build();
    }

    private ShiftAssignmentResponse mapToShiftAssignmentResponse(ShiftAssignment assignment) {
        Staff staff = assignment.getStaff();
        return ShiftAssignmentResponse.builder()
                .id(assignment.getId())
                .shiftId(assignment.getShift().getId())
                .staffId(staff.getId())
                .staffName(staff.getUser().getFirstName() + " " + staff.getUser().getLastName())
                .staffDesignation(staff.getDesignation())
                .experienceLevel(staff.getExperienceLevel())
                .status(assignment.getStatus())
                .build();
    }
}
