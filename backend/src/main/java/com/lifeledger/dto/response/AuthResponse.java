package com.lifeledger.dto.response;

public record AuthResponse(
        String token,
        String type,
        Long userId,
        String name,
        String email
) {
    public AuthResponse(String token, Long userId, String name, String email) {
        this(token, "Bearer", userId, name, email);
    }
}
