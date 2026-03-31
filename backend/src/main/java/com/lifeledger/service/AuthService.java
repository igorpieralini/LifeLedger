package com.lifeledger.service;

import com.lifeledger.dto.request.LoginRequest;
import com.lifeledger.dto.request.RegisterRequest;
import com.lifeledger.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
