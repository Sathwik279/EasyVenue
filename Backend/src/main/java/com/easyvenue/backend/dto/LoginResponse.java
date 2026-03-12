package com.easyvenue.backend.dto;

public class LoginResponse {

    private String token;
    private String email;
    private Long userId;
    private String role;
    private String username;

    public LoginResponse() {
    }

    public LoginResponse(String token, String email, Long userId, String role, String username) {
        this.token = token;
        this.email = email;
        this.userId = userId;
        this.role = role;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
