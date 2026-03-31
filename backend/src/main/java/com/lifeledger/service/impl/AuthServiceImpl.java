package com.lifeledger.service.impl;

import com.lifeledger.domain.User;
import com.lifeledger.dto.request.LoginRequest;
import com.lifeledger.dto.request.RegisterRequest;
import com.lifeledger.dto.response.AuthResponse;
import com.lifeledger.exception.BusinessException;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.security.util.JwtUtil;
import com.lifeledger.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // AuthenticationManager handles bad credentials — throws BadCredentialsException
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}
