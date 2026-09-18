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

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open `http://localhost:5173`.

## Useful scripts

- `npm run dev`: start dev server.
- `npm run lint`: run ESLint
- `npm run format`: run Prettier
- `npm run test`: run unit tests
