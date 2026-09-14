FROM maven:3.9-eclipse-temurin-21

RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pom.xml .

COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]