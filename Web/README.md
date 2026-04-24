# LifeLedger

Aplicação full-stack para gerenciamento de vida pessoal.

## Stack

- **Backend**: Java 21, Spring Boot 3.4, PostgreSQL, Flyway
- **Frontend**: Angular 21, SCSS

## Requisitos

- Java 21+
- Node.js 22+
- PostgreSQL 15+

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

API disponível em `http://localhost:8080/api`

## Frontend

```bash
cd frontend
npm install
ng serve
```

App disponível em `http://localhost:4200`

O proxy encaminha `/api/*` para o backend automaticamente.
