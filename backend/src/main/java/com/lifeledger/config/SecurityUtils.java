package com.lifeledger.config;

import com.lifeledger.domain.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    /** ID do usuário padrão quando autenticação está desativada. */
    private static final Long DEFAULT_USER_ID = 1L;

    private SecurityUtils() {}

    public static Long currentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof User user) {
                return user.getId();
            }
        } catch (Exception ignored) {}
        return DEFAULT_USER_ID;
    }
}
