package com.techstore.techstore_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@ToString(exclude = {"password", "addresses"}) // Empêche Lombok de boucler
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore // Sécurité : Cache le mot de passe
    @Column(name = "password_hash")
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CLIENT;

    @Column(name = "oauth_provider")
    private String oauthProvider;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "is_verified")
    private boolean isVerified = false;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    // On ignore les adresses ici pour que Swagger ne crash pas en essayant de tout charger
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Address> addresses;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    private String profilePictureUrl; // Pour stocker le lien de la photo
}