# --- Use Maven Image with JDK ---
    FROM maven:3.9.6-eclipse-temurin-17

    # Set the working directory
    WORKDIR /app
    
    # Copy only the pom.xml first to leverage caching for dependencies
    COPY pom.xml .
    
    # Download dependencies in advance to speed up builds
    RUN mvn dependency:go-offline
    
    # Copy the entire project
    COPY . .
    
    # Expose the application port
    EXPOSE 8080
    
    # Clean the project and ensure a fresh build
    RUN mvn clean
    
    # Run the Spring Boot application directly using Maven
    CMD ["mvn", "spring-boot:run"]
    