package DATAJPA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DataJPA_Application {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(DataJPA_Application.class);

        // Tell Spring Boot to load "application-rest.properties" instead of the default
        app.setDefaultProperties(java.util.Map.of(
                "spring.config.name", "application-DataJPA"
        ));

        app.run(args);
    }
}
