# Osaamisenhallinta backend

Spring Boot backend for Osaamisenhallinta.

## Tech stack

- Java 21
- Maven 3.9
- Spring Boot 4.1
- Checkstyle 3.6
- Spotless 3.10

## Requirements

The whole application can be run with `docker compose up --build`, so it is not necessary to run the backend locally.

If you want to run the backend locally, you need:

- Java 21 (e.g. Eclipse Temurin) ([download](https://adoptium.net/temurin/releases?version=21&os=any&arch=any))

The project uses Maven Wrapper, so Maven does not need to be installed separately.

## Setup Backend locally

1. Create `.env` in the repository root if it does not already exist (use `.env.example` as a template):

```env
POSTGRES_DB=database_name
POSTGRES_USER=username
POSTGRES_PASSWORD=password
```

2. Change directory to backend:

```bash
cd backend
```

3. Start the database with Docker

```bash
docker compose up -d db
```

4. Start the backend application.

On Linux/macOS (Not tested):

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

On Windows:

```bash
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

5. Open http://localhost:8080.

## Useful commands

On Windows, use `mvnw.cmd` instead of `./mvnw`. For example: `mvnw.cmd spring-boot:run`.

- `./mvnw spring-boot:run`: start the backend
- `./mvnw test`: run tests
- `./mvnw compile`: compile the project
- `./mvnw verify`: build and verify the project
- `./mvnw spotless:check`: check code formatting
- `./mvnw spotless:apply`: format the code
- `./mvnw checkstyle:check`: check code style
