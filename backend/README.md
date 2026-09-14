# Osaamisenhallinta backend

Spring Boot backend for Osaamisenhallinta

## Tech stack

- Java 21
- Maven 3.9
- Spring Boot 4.1
- Checkstyle 3.6
- Spotless 3.10

## Requirements

- Java 21

The project uses Maven Wrapper, so Maven does not need to be installed separately.

## Setup

1. Start the backend application

```bash
./mvnw spring-boot:run
```

2. Open http://localhost:8080.

## Useful commands

- `./mvnw spring-boot:run`: start the backend
- `./mvnw test`: run tests
- `./mvnw compile`: compile the project
- `./mvnw verify`: build and verify the project
- `./mvnw spotless:check`: check code formatting
- `./mvnw spotless:apply`: format the code
- `./mvnw checkstyle:check`: check code style