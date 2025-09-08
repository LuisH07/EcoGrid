# Stage 1: Build
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Build do projeto sem testes
RUN mvn clean install -DskipTests

# Stage 2: Imagem final leve
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copia o JAR da imagem de build
COPY --from=build /app/target/*.jar app.jar

# Porta do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
