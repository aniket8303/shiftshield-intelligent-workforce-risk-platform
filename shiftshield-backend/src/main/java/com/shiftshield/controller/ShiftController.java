package com.shiftshield.controller;

import com.shiftshield.dto.ShiftAssignmentRequest;
import com.shiftshield.dto.ShiftAssignmentResponse;
import com.shiftshield.dto.ShiftRequest;
import com.shiftshield.dto.ShiftResponse;
import com.shiftshield.service.ShiftService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping
    public ResponseEntity<List<ShiftResponse>> getAllShifts(
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate) {
        return ResponseEntity.ok(shiftService.getAllShifts(departmentId, startDate, endDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShiftResponse> getShiftById(@PathVariable Integer id) {
        return ResponseEntity.ok(shiftService.getShiftById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('NURSING_SUPERINTENDENT', 'DEPARTMENT_HEAD', 'HR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ShiftResponse> createShift(@Valid @RequestBody ShiftRequest request) {
        return new ResponseEntity<>(shiftService.createShift(request), HttpStatus.CREATED);
    }

    @GetMapping("/{shiftId}/assignments")
    public ResponseEntity<List<ShiftAssignmentResponse>> getShiftAssignments(
            @PathVariable Integer shiftId) {
        return ResponseEntity.ok(shiftService.getShiftAssignments(shiftId));
    }

    @GetMapping("/my-assignments")
    @PreAuthorize("hasAnyRole('STAFF', 'SUPERVISOR')")
    public ResponseEntity<List<ShiftAssignmentResponse>> getMyAssignments() {
        return ResponseEntity.ok(shiftService.getMyAssignments());
    }

    @GetMapping("/{shiftId}/eligible-staff")
    public ResponseEntity<List<com.shiftshield.dto.StaffResponse>> getEligibleStaffForShift(
            @PathVariable Integer shiftId) {
        return ResponseEntity.ok(shiftService.findEligibleStaffForShift(shiftId));
    }

    @PostMapping("/{shiftId}/assignments")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'NURSING_SUPERINTENDENT', 'DEPARTMENT_HEAD', 'SYSTEM_ADMIN')")
    public ResponseEntity<ShiftAssignmentResponse> assignStaffToShift(
            @PathVariable Integer shiftId,
            @Valid @RequestBody ShiftAssignmentRequest request) {
        return new ResponseEntity<>(shiftService.assignStaffToShift(shiftId, request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{shiftId}/assignments/{assignmentId}")
    public ResponseEntity<Void> unassignStaff(
            @PathVariable Integer shiftId,
            @PathVariable Integer assignmentId) {
        shiftService.unassignStaff(shiftId, assignmentId);
        return ResponseEntity.noContent().build();
    }
}
