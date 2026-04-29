package com.techstore.techstore_api.exception;

import com.techstore.techstore_api.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<String>> handleConflict(Exception e) {
        return ResponseEntity.status(409).body(
            ApiResponse.<String>builder()
                .status("error")
                .code(409)
                .message("Erreur de données : Ce code SKU ou ce Slug existe déjà.")
                .timestamp(LocalDateTime.now())
                .build()
        );
    }
}