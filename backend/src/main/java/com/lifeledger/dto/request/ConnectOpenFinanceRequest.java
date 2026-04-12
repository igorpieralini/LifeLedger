package com.lifeledger.dto.request;

/**
 * Request body for POST /pluggy/connect-open-finance.
 *
 * connectorId: ID do conector Open Finance do banco (ex: 601 = Itaú PF)
 * cpf: CPF do usuário no formato "000.000.000-00" ou "00000000000"
 */
public record ConnectOpenFinanceRequest(
        int connectorId,
        String cpf
) {}
