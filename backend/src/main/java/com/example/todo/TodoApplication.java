package com.example.todo;

import com.example.todo.config.DatabaseEnvLogger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TodoApplication {

    public static void main(String[] args) {
        DatabaseEnvLogger.log();
        SpringApplication.run(TodoApplication.class, args);
    }
}
