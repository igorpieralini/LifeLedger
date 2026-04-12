package com.lifeledger.dto.response;

/**
 * Pluggy POST /auth response — contains the short-lived API key.
 */
public record PluggyAuthResponse(String apiKey) {}
