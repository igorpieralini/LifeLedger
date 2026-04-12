package com.lifeledger.dto.request;

/**
 * Request body accepted by POST /pluggy/connect-account.
 * credentials must match the sandbox connector's required fields
 * (for connector 0: user = "user-ok", password = "password-ok").
 */
public record ConnectAccountRequest(
        String user,
        String password
) {}

