package com.lifeledger.service.impl;

import java.util.List;

public final class CategoryMatcher {

    public record Match(String categoryName, String color, String icon) {}

        static final Match DEFAULT = new Match("Outros itens", "#6b7280", "category");

    private record Rule(String categoryName, String color, String icon, String... keywords) {}

    private static final List<Rule> RULES = List.of(

        new Rule("Salário",            "#10b981", "payments",
                "SALARIO", "SALÁRIO", "PAGAMENTO SALARIO", "PGTO SAL",
                "REMUNERACAO", "REMUNERAÇÃO", "PROVENTO", "FOLHA PGTO"),

        new Rule("Investimentos",      "#0d9488", "trending_up",
                "RESGATE", "RENDIMENTO", "REND PAGO",
                "APLICACAO", "APLICAÇÃO",
                "COR OPERACOES",
                "INVEST", "FUNDO ", "CDB ", "TESOURO"),

        new Rule("Outros Ganhos",      "#059669", "attach_money",
                "PIX RECEBIDO", "TRANSFERENCIA RECEBIDA", "TED RECEBIDO",
                "PIX ORIGEM CARTAO",
                "DEP DIN",
                "DEPOSITO", "REEMBOLSO", "DEVOLUCAO"),

        new Rule("Restaurante",        "#f59e0b", "restaurant",
                "IFOOD", "RAPPI", "UBER EATS", "UBEREATS",
                "RESTAURANTE", "LANCHONETE", "LANCHE", "HAMBURGUER",
                "PIZZA", "PIZZARIA", "PADARIA", "CAFE ", "CAFETERIA",
                "SUSHI", "CHURRASCO", "BAR ", "PASTELARIA", "PASTEL",
                "ACAI", "AÇAÍ", "SORVETERIA"),

        new Rule("Mercado",            "#d97706", "shopping_cart",
                "SUPERMERCADO", "MERCADO", "CARREFOUR", "EXTRA ",
                "ATACADAO", "ASSAI", "WALMART", "SACOLAO",
                "HORTIFRUTI", "FEIRA "),

        new Rule("App de Transporte",  "#6366f1", "local_taxi",
                "UBER", "99POP", "99PAY", "99 TECNO", "99FOOD",
                "TAXI", "CABIFY", "INDRIVER", "BOLT "),

        new Rule("Combustível",        "#4f46e5", "local_gas_station",
                "POSTO ", "COMBUSTIVEL", "GASOLINA", "ALCOOL POSTO",
                "BR DISTRIBUID", "SHELL ", "PETROBRAS DISTR"),

        new Rule("Transferências",     "#94a3b8", "swap_horiz",
                "PIX TRANSF", "PIX ENV", "TED ", "DOC ",
                "TRANSFERENCIA", "TRANSFERÊNCIA"),

        new Rule("Transporte Público", "#818cf8", "directions_bus",
                "METRO ", "METRO.", "SPTRANS", "BILHETE UNICO",
                "ONIBUS", "BRT ", "METRÔ", "AUTOPASS", "CARTAO BUS",
                "PASSE RAPIDO"),

        new Rule("Aluguel",            "#8b5cf6", "home",
                "ALUGUEL", "CONDOMINIO", "CONDOMÍNIO", "IPTU"),

        new Rule("Energia",            "#f59e0b", "bolt",
                "ENERGIA", "ENEL ", "CEMIG", "CPFL", "COELBA",
                "COELCE", "CELPE", "EQUATORIAL", "LUZ "),

        new Rule("Água",               "#38bdf8", "water_drop",
                "SABESP", "SANEAMENTO", "AGUA ", "ÁGUA",
                "CAESB", "EMBASA", "CAERN"),

        new Rule("Internet/Telefone",  "#0ea5e9", "wifi",
                "INTERNET", "FIBRA", "BANDA LARGA",
                "VIVO ", "CLARO ", "TIM ", "OI ", "NEXTEL",
                "TELECOM"),

        new Rule("Compras Online",     "#ec4899", "shopping_bag",
                "AMAZON", "SHOPEE", "MERCADO LIVRE", "MERCADOLIVRE",
                "ALIEXPRESS", "MAGAZINE LUIZA", "MAGALU",
                "AMERICANAS", "SUBMARINO", "NETSHOES",
                "PAGSEGURO", "PAYPAL", "MERCADOPAGO"),

        new Rule("Vestuário",          "#f472b6", "checkroom",
                "ZARA", "RENNER", "RIACHUELO", "HERING",
                "C&A", "MARISA", "LOJAS "),

        new Rule("Streaming",          "#a855f7", "movie",
                "NETFLIX", "SPOTIFY", "DISNEY", "HBO",
                "AMAZON PRIME", "DEEZER", "YOUTUBE PREMIUM",
                "GLOBOPLAY", "PARAMOUNT"),

        new Rule("Lazer / Entretenimento", "#9333ea", "local_activity",
                "CINEMA", "INGRESSO", "TEATRO", "SHOW ",
                "EVENTO ", "PARQUE ", "BOWLING"),

        new Rule("Farmácia",           "#10b981", "local_pharmacy",
                "FARMACIA", "FARMÁCIA", "DROGARIA",
                "DROGA", "ULTRAFARMA", "PACHECO"),

        new Rule("Plano de Saúde",     "#059669", "health_and_safety",
                "PLANO DE SAUDE", "HAPVIDA", "UNIMED", "BRADESCO SAUDE",
                "SULAMERICA", "AMIL ", "NOTREDAME"),

        new Rule("Educação",           "#6366f1", "school",
                "CURSO ", "FACULDADE", "ESCOLA ", "COLEGIO",
                "UDEMY", "ALURA", "COURSERA", "ROCKETSEAT",
                "MENSALIDADE", "FUNDACAO EDUCACIONAL", "FUNDAÇÃO",
                "UNIV ", "UNIVERSIDADE", "COLEGIO"),

        new Rule("Fatura do cartão",   "#fb7185", "credit_card",
                "FATURA PAGA", "PAGAMENTO FATURA", "PAG FATURA",
                "FATURA CARTAO", "FATURA CARTÃO"),

        new Rule("Boletos",            "#f97316", "receipt",
                "BOLETO", "PAGAMENTO BOLETO", "PAG BOLETO",
                "DARF", "GPS ", "FGTS", "TRIBUTO", "ARRECADACAO"),

        new Rule("Taxas Bancárias",    "#f43f5e", "account_balance",
                "TARIFA", "JUROS", "IOF", "TAXA ",
                "ANUIDADE", "SEGURO CARTAO", "STARK BANK",
                "CONSORCIO", "CONSÓRCIO")
    );

    public static Match match(String description) {
        String upper = description.toUpperCase();
        for (Rule rule : RULES) {
            for (String kw : rule.keywords()) {
                if (upper.contains(kw)) {
                    return new Match(rule.categoryName(), rule.color(), rule.icon());
                }
            }
        }
        return DEFAULT;
    }

    private CategoryMatcher() {}
}
