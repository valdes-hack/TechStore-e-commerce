package com.techstore.techstore_api.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_address_id", nullable = false)
    private Address shippingAddress;

    private BigDecimal totalAmount;
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.EN_ATTENTE;

    private String paymentStatus = "PENDING"; // PENDING, SUCCESS, FAILED
    private String paymentMethod; // "CASH_ON_DELIVERY" ou "MOBILE_MONEY"

    @Builder.Default
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;
}