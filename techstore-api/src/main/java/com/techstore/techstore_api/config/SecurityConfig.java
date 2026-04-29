package com.techstore.techstore_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Activation du CORS avec les réglages définis plus bas
            .cors(Customizer.withDefaults())
            
            // 2. Désactivation du CSRF (pour API REST Stateless)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 3. Gestion de session sans état (JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Configuration des routes et des accès
            .authorizeHttpRequests(auth -> auth
                // ACCÈS PUBLIC : SWAGGER & DOCS
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/favicon.ico", "/error").permitAll()
                
                // ACCÈS PUBLIC : AUTHENTIFICATION & PANIER (Important ✨)
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/cart/**").permitAll()
                
                // ACCÈS PUBLIC : CATALOGUE (Français + Anglais)
                .requestMatchers("/api/v1/products/**").permitAll()
                .requestMatchers("/api/v1/produits/**").permitAll()
                .requestMatchers("/api/v1/categories/**").permitAll()
                
                // ACCÈS PRIVÉ : ADMINISTRATION (Seulement pour les ADMIN)
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                
                // TOUT LE RESTE nécessite une simple authentification
                .anyRequest().authenticated()
            );

        // Ajout du filtre de sécurité avant de valider la requête
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

   @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // On autorise ton Front-end
    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
    
    // On autorise toutes les méthodes
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    
    // ✨ LE FIX RADICAL POUR LES HEADERS :
    // On autorise l'étoile '*' pour les Headers pour que X-Session-Id passe quoi qu'il arrive !
    configuration.setAllowedHeaders(List.of("*")); 
    
    // On expose aussi les headers pour que le Front puisse les lire si besoin
    configuration.setExposedHeaders(List.of("X-Session-Id", "Authorization"));
    
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}