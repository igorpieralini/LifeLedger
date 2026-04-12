package com.lifeledger.dto.response;

public record PluggyItemResponse(
        String id, String status, Integer connectorId,
        String oauthUrl, String createdAt, String updatedAt
) {}
