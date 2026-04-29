package com.techstore.techstore_api.service.impl;

import com.techstore.techstore_api.dto.request.OrderRequest;
import com.techstore.techstore_api.dto.response.OrderResponse;
import com.techstore.techstore_api.dto.response.OrderItemResponse;
import com.techstore.techstore_api.model.*;
import com.techstore.techstore_api.repository.*;
import com.techstore.techstore_api.service.CartService;
import com.techstore.techstore_api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;

    /**
     * 1. CRÉATION DE LA COMMANDE
     */
    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request, String userEmail) {
        // 1. Récupérer l'utilisateur et son panier
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Le panier est vide"));

        if (cart.getItems().isEmpty()) throw new RuntimeException("Le panier est vide");

        // 2. Récupérer l'adresse de livraison
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException("Adresse non trouvée"));

        // 3. Créer l'enveloppe de la commande
        Order order = Order.builder()
                .user(user)
                .shippingAddress(address)
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.EN_ATTENTE)
                .totalAmount(calculateTotal(cart))
                .shippingFee(BigDecimal.ZERO) 
                .build();

        // 4. Transformer les items du panier en items de commande + APPEL PROCÉDURE STOCK
       // 4. Transformer les items du panier en items de commande
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            
            // Appel procédure stockée
            productRepository.deductStock(
                cartItem.getProduct().getId(), 
                cartItem.getVariant() != null ? cartItem.getVariant().getId() : null, 
                cartItem.getQuantity()
            );

            return OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .variant(cartItem.getVariant())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .productName(cartItem.getProduct().getName()) // <--- AJOUTE CETTE LIGNE
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.saveAndFlush(order); // On utilise saveAndFlush pour forcer l'écriture

        // On vide le panier
        cartService.clearCart(userEmail, true);

        // On retourne la réponse
        return mapToResponse(savedOrder);
    }

    /**
     * 2. RÉCUPÉRER MES COMMANDES
     */
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * 3. DÉTAIL D'UNE COMMANDE
     */
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetails(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        
        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Accès refusé à cette commande");
        }
        return mapToResponse(order);
    }

    /**
     * CALCUL DU TOTAL DU PANIER
     */
    private BigDecimal calculateTotal(Cart cart) {
        return cart.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * MÉTHODE DE MAPPING (ENTITÉ -> DTO)
     * C'est cette méthode qui génère le JSON pour Swagger/React
     */
    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
            return OrderItemResponse.builder()
                    .productName(item.getProduct().getName())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .subTotal(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())))
                    .build();
        }).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber("TS-" + order.getCreatedAt().getYear() + "-" + order.getId())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddressLabel(order.getShippingAddress().getLabel())
                .items(itemResponses)
                .build();
    }
    @Override
@Transactional(readOnly = true)
public List<OrderResponse> getAllOrdersForAdmin() {
    return orderRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

@Override
@Transactional
public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
    
    order.setStatus(status);
    return mapToResponse(orderRepository.save(order));
}
}