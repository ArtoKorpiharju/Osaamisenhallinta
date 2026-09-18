# Osaamisenhallinta

Full-stack application using React, Spring Boot and PostgreSQL.

## Repository structure

- [frontend](./frontend/): React frontend
- [backend](./backend/): Spring Boot backend service

## Current stack

- Frontend: Vite 8, React 19, TypeScript 6, ESLint 10, Prettier 3
- Backend: Java 21, Maven 3.9, Spring Boot 4.1, Checkstyle 3.6, Spotless 3.10
- Database: PostgreSQL 18
- Web server / reverse proxy: Nginx 1.30.4
- Tooling: Docker Compose

## Run with Docker Compose

To run the application with Docker Compose, you need Docker Desktop ([download](https://www.docker.com/products/docker-desktop/)).

1. Create `.env` in the repository root (use `.env.example` as a template):

```env
POSTGRES_DB=database_name
POSTGRES_USER=username
POSTGRES_PASSWORD=password
```

2. Build and run:

```bash
docker compose up --build
```

3. Open `http://localhost:5173`.

## Tests

There are three different test categories. Unit tests for frontend and backend and end to end tests which boot the full stack. The tests can be run from the root of the repository by:

- Frontend: `cd frontend && npm run test` (Vitest + Testing Library)
- Backend: `cd backend && ./mvnw test` or `cd backend && mvnw test` on Windows (Maven)
- End to end: `npm run e2e-test`

All three run automatically in CI on every push and pull request.
