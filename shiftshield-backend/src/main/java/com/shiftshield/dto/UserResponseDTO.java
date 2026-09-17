package com.shiftshield.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Integer id;

    private String email;

    private String firstName;

    private String lastName;

    private String phone;

    private String role;

    private String status;

    private LocalDateTime createdAt;

    private Integer organizationId;

    private String organizationName;
}