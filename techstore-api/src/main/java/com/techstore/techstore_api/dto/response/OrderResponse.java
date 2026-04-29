package com.techstore.techstore_api.dto.response;

import com.techstore.techstore_api.model.OrderStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber; 
    private LocalDateTime createdAt;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String shippingAddressLabel;
    private List<OrderItemResponse> items; // Maintenant ce sera vert car le fichier existe
} // <--- L'accolade de fermeture qui manquait