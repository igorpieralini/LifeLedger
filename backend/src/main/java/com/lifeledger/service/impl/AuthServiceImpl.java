package com.lifeledger.service.impl;

import com.lifeledger.domain.User;
import com.lifeledger.dto.request.LoginRequest;
import com.lifeledger.dto.request.RegisterRequest;
import com.lifeledger.dto.response.AuthResponse;
import com.lifeledger.exception.BusinessException;
import com.lifeledger.repository.UserRepository;
import com.lifeledger.security.JwtTokenProvider;
import com.lifeledger.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BusinessException("Email already registered");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase().trim())
                .password(passwordEncoder.encode(request.password()))
                .build();

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}
