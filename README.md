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
- Testing: Vitest 3, Playwright 1.64
- Tooling: Docker Compose, Node.js 24

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

Backend, frontend and e2e tests run automatically when pushing to Github.

### How to run backend tests

All commands assume the current working directory is /backend

```bash
cd backend
```

1. Start the database and wait that it's running:

```bash
docker compose up -d db
```

2. Run Maven tests using the local spring boot properties:

On Linux/macOS (MacOS not tested):

```bash
./mvnw clean test "-Dspring.profiles.active=local"
```

On Windows:

Using git Bash:

```bash
./mvnw clean test "-Dspring.profiles.active=local"
```

Or cmd / Powershell:

```powershell
.\mvnw.cmd clean test "-Dspring.profiles.active=local"
```

3. See test results in terminal.

### How to run frontend tests

All commands assume the current working directory is /frontend

Run `npm run test` (Vitest + Testing Library)

### How to run end-to-end tests

All commands assume the current working directory is root

1. Start by installing playwright by running:

```bash
npx playwright install
```

If Playwright reports that required system dependencies are missing, run

```bash
npx playwright install-deps
```

2. Run tests by command:

```bash
npx playwright test
```

Note: playwright does not build a new docker volume if one already exists. In this case use:

```bash
docker compose down -v
```

before testing again

3. Playwright usually automatically opens web page on failed tests

You can also get report of the last test run by:

```bash
npx playwright show-report
```
