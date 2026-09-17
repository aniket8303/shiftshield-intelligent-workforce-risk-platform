# Stage 1: Build the frontend (Vite React)
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend (Spring Boot Maven)
FROM eclipse-temurin:17-jdk-alpine AS backend-builder
WORKDIR /app
# Copy the maven wrapper and pom.xml first
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

# Copy source code and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 3: Package the final image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=backend-builder /app/target/*.jar app.jar
# (Optional) Normally we might copy frontend static files into src/main/resources/static if serving from spring boot
# But since this is API separated, we assume a separate deployment or reverse proxy for frontend. 
# We'll just run the spring boot backend here.
EXPOSE 8080
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app/app.jar"]
