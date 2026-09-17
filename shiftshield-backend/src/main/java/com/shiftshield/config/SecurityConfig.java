package com.shiftshield.config;

import com.shiftshield.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public auth endpoints
                        .requestMatchers("/api/auth/**", "/api/contact/**").permitAll()

                        // Admin Only endpoints
                        .requestMatchers("/api/admin/**").hasRole("SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/risk-rules/**").hasRole("SYSTEM_ADMIN")

                        // HR Only endpoints for modifying staff/org setup
                        .requestMatchers(HttpMethod.POST, "/api/staff/**", "/api/departments/**").hasAnyRole("HR", "SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/staff/**", "/api/departments/**").hasAnyRole("HR", "SYSTEM_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/staff/**", "/api/departments/**").hasAnyRole("HR", "SYSTEM_ADMIN")

                        // Public operational endpoints for Demo purposes (Read-only)
                        .requestMatchers(HttpMethod.GET, "/api/departments/**", "/api/shifts/**", "/api/staff/**", "/api/risk/**").permitAll()

                        // Role-based Shift management
                        .requestMatchers(HttpMethod.POST, "/api/shifts/*/assignments").hasAnyRole("SUPERVISOR", "NURSING_SUPERINTENDENT", "DEPARTMENT_HEAD")
                        .requestMatchers(HttpMethod.DELETE, "/api/shifts/*/assignments/*").hasAnyRole("SUPERVISOR", "NURSING_SUPERINTENDENT", "DEPARTMENT_HEAD")
                        .requestMatchers(HttpMethod.POST, "/api/shifts/**").hasAnyRole("NURSING_SUPERINTENDENT", "DEPARTMENT_HEAD", "HR")

                        // Any authenticated user can access basic info (with method-level security checking org isolation)
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*", 
            "http://127.0.0.1:*",
            "https://*.vercel.app",
            "https://shiftshield-*.vercel.app",
            "https://shiftshield.com",
            "https://*.shiftshield.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}