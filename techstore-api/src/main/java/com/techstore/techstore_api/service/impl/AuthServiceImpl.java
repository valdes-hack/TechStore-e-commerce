package com.techstore.techstore_api.service.impl;

import com.techstore.techstore_api.config.JwtUtils;
import com.techstore.techstore_api.dto.request.LoginRequest;
import com.techstore.techstore_api.dto.request.RegisterRequest;
import com.techstore.techstore_api.dto.response.ApiResponse;
import com.techstore.techstore_api.dto.response.AuthResponse;
import com.techstore.techstore_api.dto.response.UserResponse;
import com.techstore.techstore_api.model.Role;
import com.techstore.techstore_api.model.User;
import com.techstore.techstore_api.repository.UserRepository;
import com.techstore.techstore_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    /**
     * INSCRIPTION D'UN NOUVEL UTILISATEUR (AVEC PHOTO)
     */
    @Override
    @Transactional
    public ApiResponse<UserResponse> registerUser(RegisterRequest request) {
        // 1. Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.<UserResponse>builder()
                    .status("error")
                    .code(400)
                    .message("Erreur : Cet email est déjà utilisé.")
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        // 2. Créer l'entité et hacher le mot de passe
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .profilePictureUrl(request.getProfilePictureUrl()) // AJOUT : Enregistre le lien de la photo
                .role(Role.CLIENT)
                .isVerified(true)
                .build();

        User savedUser = userRepository.save(user);

        return ApiResponse.<UserResponse>builder()
                .status("success")
                .code(201)
                .message("Utilisateur créé avec succès !")
                .timestamp(LocalDateTime.now())
                .data(mapToUserResponse(savedUser))
                .build();
    }

    /**
     * CONNEXION (LOGIN)
     */
    @Override
    public ApiResponse<AuthResponse> loginUser(LoginRequest request) {
        try {
            // 1. Tentative d'authentification
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Si succès, on met à jour le contexte de sécurité
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Génération du Token JWT
            String jwt = jwtUtils.generateJwtToken(authentication);

            // 4. Récupération des infos utilisateur
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé après authentification"));

            AuthResponse authResponse = new AuthResponse(jwt, mapToUserResponse(user));

            return ApiResponse.<AuthResponse>builder()
                    .status("success")
                    .code(200)
                    .message("Connexion réussie")
                    .timestamp(LocalDateTime.now())
                    .data(authResponse)
                    .build();

        } catch (BadCredentialsException e) {
            System.out.println("ERREUR LOGIN : Identifiants incorrects pour " + request.getEmail());
            return ApiResponse.<AuthResponse>builder()
                    .status("error")
                    .code(401)
                    .message("Email ou mot de passe incorrect.")
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            System.out.println("ERREUR CRITIQUE LOGIN : " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.<AuthResponse>builder()
                    .status("error")
                    .code(500)
                    .message("Une erreur interne est survenue lors de la connexion.")
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    /**
     * MÉTHODE PRIVÉE DE MAPPING (DTO)
     * On inclut la photo de profil pour que React puisse l'afficher
     */
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .profilePictureUrl(user.getProfilePictureUrl()) // AJOUT : Renvoie le lien au Frontend
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}