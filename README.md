# Osaamisenhallinta

Full-stack application using React, Spring Boot and PostgreSQL.

## Repository structure

- [frontend](./frontend/): React UI
- [backend](./backend/): Spring Boot backend service

## Current stack

- Frontend: Vite 8, React 19, TypeScript 6, ESLint 10, Prettier 3
- Backend: Java 21, Maven 3.9, Spring Boot 4.1, Checkstyle 3.6, Spotless 3.10
- Database: PostgreSQL 18
- Web server / reverse proxy: Nginx 1.30.4
- Tooling: Docker Compose

## Run with Docker Compose

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

## Run frontend locally

Make sure Node.js and npm are installed.

1. Go to the [frontend](./frontend/) folder

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open `http://localhost:5173`.