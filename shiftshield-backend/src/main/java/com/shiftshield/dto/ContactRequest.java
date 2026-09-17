package com.shiftshield.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    private String organization;
    
    @NotBlank
    @Email
    private String email;
    
    private String phone;
    
    private String role;
    
    @NotBlank
    private String message;
}
