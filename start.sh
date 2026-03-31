#!/bin/bash
# LifeLedger — quick start script
set -e

echo "==> Starting PostgreSQL via Docker..."
docker compose up -d postgres

echo "==> Waiting for database..."
until docker compose exec postgres pg_isready -U postgres -q; do
  sleep 1
done
echo "    Database is ready."

echo "==> Starting Backend (Spring Boot)..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

echo "==> Waiting for backend..."
until curl -sf http://localhost:8080/api/auth/ping > /dev/null 2>&1 || \
      curl -o /dev/null -s -w "%{http_code}" http://localhost:8080/api/auth/login | grep -qE "^(200|400|405)$"; do
  sleep 2
done
echo "    Backend is ready at http://localhost:8080/api"

echo "==> Starting Frontend (Angular)..."
cd frontend
npm install --silent
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║          LifeLedger is running!          ║"
echo "  ║  Frontend : http://localhost:4200         ║"
echo "  ║  Backend  : http://localhost:8080/api     ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all services."

cleanup() {
  echo "Stopping services..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  docker compose stop postgres
}
trap cleanup INT TERM

wait
