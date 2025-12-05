# Multi-stage build for CareSync Hospital Management System
# Optimized for Render.com deployment

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --production=false
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
# Copy frontend build into backend static resources
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Production Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy backend jar (includes frontend static files)
COPY --from=backend-build /app/target/*.jar app.jar

# Expose single port (Render requirement)
EXPOSE 8080

# Environment variables for production
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Run the application
CMD ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
