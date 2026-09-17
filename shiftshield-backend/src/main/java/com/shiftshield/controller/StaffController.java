package com.shiftshield.controller;

import com.shiftshield.dto.StaffRequest;
import com.shiftshield.dto.StaffResponse;
import com.shiftshield.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<Page<StaffResponse>> getAllStaff(
            @RequestParam(required = false) Integer departmentId,
            Pageable pageable) {
        
        if (departmentId != null) {
            return ResponseEntity.ok(staffService.getStaffByDepartment(departmentId, pageable));
        }
        return ResponseEntity.ok(staffService.getAllStaff(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable Integer id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PostMapping
    public ResponseEntity<StaffResponse> createStaff(@Valid @RequestBody StaffRequest request) {
        return new ResponseEntity<>(staffService.createStaff(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable Integer id,
            @Valid @RequestBody StaffRequest request) {
        return ResponseEntity.ok(staffService.updateStaff(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}
