package com.techstore.techstore_api.service;

import com.techstore.techstore_api.dto.request.LoginRequest;
import com.techstore.techstore_api.dto.request.RegisterRequest;
import com.techstore.techstore_api.dto.response.ApiResponse;
import com.techstore.techstore_api.dto.response.AuthResponse;
import com.techstore.techstore_api.dto.response.UserResponse;

public interface AuthService {
    // Méthode pour inscrire un nouvel utilisateur
    ApiResponse<UserResponse> registerUser(RegisterRequest registerRequest);
    ApiResponse<AuthResponse> loginUser(LoginRequest loginRequest);
}