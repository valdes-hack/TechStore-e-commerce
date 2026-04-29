package com.techstore.techstore_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private String status;      // "success" ou "error"
    private int code;           // 200, 201, 400...
    private String message;
    private LocalDateTime timestamp;
    private T data;             // Les données réelles (User, Product...)
}