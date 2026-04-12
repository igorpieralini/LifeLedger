package com.lifeledger.dto.response;

/**
 * Pluggy POST /items response — represents a connected bank account item.
 * oauthUrl is populated for Open Finance connectors (ID >= 600).
 * The user must open this URL to authorize the connection with the bank.
 */
public record PluggyItemResponse(
        String id,
        String status,
        Integer connectorId,
        String oauthUrl,
        String createdAt,
        String updatedAt
) {}
