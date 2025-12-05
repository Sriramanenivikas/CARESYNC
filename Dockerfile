FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG REACT_APP_API_URL=/api
ARG REACT_APP_ADMIN_USER=admin
ARG REACT_APP_ADMIN_PASS=admin
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ADMIN_USER=$REACT_APP_ADMIN_USER
ENV REACT_APP_ADMIN_PASS=$REACT_APP_ADMIN_PASS
RUN npm run build

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
COPY --from=frontend-build /app/build ./static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
