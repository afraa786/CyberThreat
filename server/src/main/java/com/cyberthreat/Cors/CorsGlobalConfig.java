package com.cyberthreat.Cors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsGlobalConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        // ✅ Use patterns so you can allow multiple environments
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",   // Frontend dev
                "http://localhost:3000",
                "https://your-frontend.com" // Production domain
        ));

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // ✅ Optional: expose Authorization header so frontend can read JWT
        config.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
