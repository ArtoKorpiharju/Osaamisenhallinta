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

## Setup

1. Start the backend application.

On Linux/macOS:
```bash
./mvnw spring-boot:run
```

On Windows:
```bash
mvnw.cmd spring-boot:run
```

2. Open http://localhost:8080.

## Useful commands

On Windows, use `mvnw.cmd` instead of `./mvnw`. For example: `mvnw.cmd spring-boot:run`.

- `./mvnw spring-boot:run`: start the backend
- `./mvnw test`: run tests
- `./mvnw compile`: compile the project
- `./mvnw verify`: build and verify the project
- `./mvnw spotless:check`: check code formatting
- `./mvnw spotless:apply`: format the code
- `./mvnw checkstyle:check`: check code style