package com.caresync.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Web configuration for serving React SPA from Spring Boot.
 * All non-API routes are forwarded to index.html for client-side routing.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from /static folder
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If the requested resource exists and is readable, serve it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // For SPA routing: if not an API call or static file, serve index.html
                        if (!resourcePath.startsWith("api/") && 
                            !resourcePath.startsWith("api-docs") &&
                            !resourcePath.startsWith("swagger") &&
                            !resourcePath.contains(".")) {
                            return new ClassPathResource("/static/index.html");
                        }
                        
                        return requestedResource;
                    }
                });
    }
}
