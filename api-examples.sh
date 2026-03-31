#!/bin/bash
# LifeLedger — API examples using curl
# Run: chmod +x api-examples.sh && ./api-examples.sh

BASE="http://localhost:8080/api"

echo "===== AUTENTICAÇÃO ====="

echo "-- Registro --"
curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Igor Pessoa","email":"igor@example.com","password":"minhasenha123"}' | jq .

echo ""
echo "-- Login --"
TOKEN=$(curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"igor@example.com","password":"minhasenha123"}' | jq -r '.token')

echo "Token: $TOKEN"

echo ""
echo "===== METAS ====="

echo "-- Criar meta --"
curl -s -X POST "$BASE/goals" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ler 24 livros",
    "description": "2 livros por mês ao longo do ano",
    "year": 2026,
    "targetValue": 24,
    "deadline": "2026-12-31"
  }' | jq .

echo ""
echo "-- Listar metas de 2026 --"
curl -s "$BASE/goals?year=2026" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "===== FINANÇAS ====="

echo "-- Criar categoria --"
CAT_ID=$(curl -s -X POST "$BASE/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alimentação","type":"VARIABLE","color":"#FF9500","icon":"restaurant"}' | jq -r '.id')

echo "Category ID: $CAT_ID"

echo ""
echo "-- Criar despesa --"
curl -s -X POST "$BASE/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"EXPENSE\",
    \"amount\": 150.00,
    \"description\": \"Supermercado\",
    \"date\": \"2026-03-29\",
    \"categoryId\": $CAT_ID,
    \"notes\": \"Compras da semana\"
  }" | jq .

echo ""
echo "-- Criar receita --"
curl -s -X POST "$BASE/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INCOME",
    "amount": 5000.00,
    "description": "Salário",
    "date": "2026-03-05"
  }' | jq .

echo ""
echo "-- Relatório financeiro (março 2026) --"
curl -s "$BASE/transactions/summary?year=2026&month=3" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "-- Dashboard --"
curl -s "$BASE/dashboard" \
  -H "Authorization: Bearer $TOKEN" | jq .
