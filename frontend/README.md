# Osaamisenhallinta frontend

React frontend for Osaamisenhallinta.

## Tech stack

- Vite 8
- React 19
- TypeScript 6
- ESLint 10
- Prettier 3

## Requirements

The whole application can be run with `docker compose up --build`, so it is not necessary to run the frontend locally.

If you want to run the frontend locally, you need:

- Node.js 24 ([download](https://nodejs.org/en/download))
- npm (included with Node.js)

You can check if Node.js and npm are installed with:

```bash
node --version
npm --version
```

## Setup frontend locally

1. Start the database and backend application.

```bash
cd backend
```

```bash
docker compose up -d db
```

On Linux/macOS (MacOS not tested):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

On Windows:

```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

2. Open a new terminal window and start the frontend development server:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

3. Open `http://localhost:5173`.

## Useful scripts

- `npm run dev`: start dev server.
- `npm run lint`: run ESLint
- `npm run format`: run Prettier
- `npm run test`: run unit tests
