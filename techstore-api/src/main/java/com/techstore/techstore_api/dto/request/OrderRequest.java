package com.techstore.techstore_api.dto.request;

import lombok.Data;

@Data
public class OrderRequest {
    private Long addressId;      // L'adresse choisie par le client
    private String paymentMethod; // "CASH_ON_DELIVERY" ou "MOBILE_MONEY"
}