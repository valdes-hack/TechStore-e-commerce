package com.techstore.techstore_api.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ProductVariantResponse {
    private Long id;
    private String skuVariant;
    private BigDecimal price;
    private Integer stockQty;
    private String attributes; // Le JSON des caractéristiques (Couleur, RAM...)
}