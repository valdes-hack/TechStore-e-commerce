package com.techstore.techstore_api.repository;

import com.techstore.techstore_api.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySlug(String slug);

    Page<Product> findByCategoryIdAndIsActiveTrue(Long categoryId, Pageable pageable);

    Page<Product> findByIsActiveTrue(Pageable pageable);

    @Query(value = "SELECT * FROM products WHERE is_active = true AND MATCH(name, description, brand) AGAINST(?1 IN BOOLEAN MODE)", 
           countQuery = "SELECT count(*) FROM products WHERE is_active = true AND MATCH(name, description, brand) AGAINST(?1 IN BOOLEAN MODE)", 
           nativeQuery = true)
    Page<Product> searchProducts(String keyword, Pageable pageable);

    /**
     * APPEL DE LA PROCÉDURE STOCKÉE : deduct_stock
     * On utilise une requête native pour gérer les paramètres de sortie (@p_success, @p_message) 
     * directement côté MySQL sans bloquer Java.
     */
    /**
     * APPEL SIMPLIFIÉ DE LA PROCÉDURE
     */
    @Transactional
    @Modifying
    @Query(value = "CALL deduct_stock(:p_product_id, :p_variant_id, :p_quantity)", nativeQuery = true)
    void deductStock(
        @Param("p_product_id") Long productId, 
        @Param("p_variant_id") Long variantId, 
        @Param("p_quantity") Integer quantity
    );
}