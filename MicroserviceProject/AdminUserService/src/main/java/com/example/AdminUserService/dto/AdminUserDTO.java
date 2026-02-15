package com.example.AdminUserService.dto;

import lombok.Data;

@Data
public class AdminUserDTO {
    private String email;
    private String password;
    private String fullName;
    private String role;
    private String secretKey;
}
