package com.lifeledger;

import com.lifeledger.dto.response.PluggyAccountResponse;
import com.lifeledger.dto.response.PluggyItemResponse;
import com.lifeledger.dto.response.PluggyTransactionResponse;
import com.lifeledger.dto.response.PluggyTransactionsResponse;
import com.lifeledger.service.PluggyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class PluggyStartupRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(PluggyStartupRunner.class);

    // ANSI colors
    private static final String RESET  = "\u001B[0m";
    private static final String BOLD   = "\u001B[1m";
    private static final String CYAN   = "\u001B[36m";
    private static final String GREEN  = "\u001B[32m";
    private static final String YELLOW = "\u001B[33m";
    private static final String RED    = "\u001B[31m";
    private static final String DIM    = "\u001B[2m";

    private static final String SANDBOX_USER     = "user-ok";
    private static final String SANDBOX_PASSWORD = "password-ok";

    private final PluggyService pluggyService;

    public PluggyStartupRunner(PluggyService pluggyService) {
        this.pluggyService = pluggyService;
    }

    @Override
    public void run(ApplicationArguments args) {
        log.info("");
        log.info(CYAN + BOLD + "  ╔══════════════════════════════════════════╗" + RESET);
        log.info(CYAN + BOLD + "  ║         PLUGGY — Open Finance            ║" + RESET);
        log.info(CYAN + BOLD + "  ╚══════════════════════════════════════════╝" + RESET);
        log.info("");

        try {
            // 1. Conectar
            log.info(DIM + "  ► Conectando ao banco sandbox (connector 0)..." + RESET);
            PluggyItemResponse item = pluggyService.connectAccount(SANDBOX_USER, SANDBOX_PASSWORD);
            log.info(GREEN + "  ✔ Item conectado" + RESET + "  id={}  status={}", item.id(), item.status());

            // 2. Saldo
            log.info("");
            log.info(DIM + "  ► Buscando saldo..." + RESET);
            PluggyAccountResponse account = pluggyService.getBalance();
            log.info(GREEN + "  ✔ Conta : " + RESET + BOLD + "{}" + RESET + "  ({})", account.name(), account.subtype());
            log.info(GREEN + "  ✔ Número: " + RESET + "{}", account.number());
            log.info(GREEN + "  ✔ Saldo : " + RESET + BOLD + YELLOW + "{} {}" + RESET, account.currencyCode(), account.balance());

            // 3. Extrato
            log.info("");
            log.info(DIM + "  ► Buscando extrato..." + RESET);
            PluggyTransactionsResponse extrato = pluggyService.getTransactions();
            log.info(GREEN + "  ✔ {} transação(ões) encontrada(s)" + RESET, extrato.total());

            if (extrato.results() != null && !extrato.results().isEmpty()) {
                log.info("");
                log.info(CYAN + "  ┌─────────────────────────────────────────────────────────────" + RESET);
                log.info(CYAN + BOLD + "  │  EXTRATO BANCÁRIO" + RESET);
                log.info(CYAN + "  ├─────────────────────────────────────────────────────────────" + RESET);

                for (PluggyTransactionResponse tx : extrato.results()) {
                    String amountColor = "DEBIT".equalsIgnoreCase(tx.type()) ? RED : GREEN;
                    String sign        = "DEBIT".equalsIgnoreCase(tx.type()) ? "↓" : "↑";
                    String dateShort   = tx.date() != null ? tx.date().substring(0, 10) : "—";

                    log.info(CYAN + "  │ " + RESET
                            + DIM + "{}" + RESET + "  "
                            + amountColor + BOLD + "{} {} {}" + RESET + "  "
                            + "{}  " + DIM + "[{}]" + RESET,
                            dateShort, sign, tx.currencyCode(), tx.amount(),
                            tx.description(), tx.category());
                }

                log.info(CYAN + "  └─────────────────────────────────────────────────────────────" + RESET);
            }

            log.info("");

        } catch (Exception e) {
            log.error(RED + "  ✖ Falha no startup Pluggy: {}" + RESET, e.getMessage(), e);
        }
    }
}
