package org.example.jobboard.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Allow Registration & Login endpoints for everyone
                        .requestMatchers("/api/auth/**", "/api/users/register").permitAll()

                        // Allow "GET" requests (Searching jobs) for everyone
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/jobs/**").permitAll()

                        // EVERYTHING ELSE requires a login (We temporarily allow all for your testing)
                        .requestMatchers("/api/**").permitAll()
                );

        return http.build();
    }
}
