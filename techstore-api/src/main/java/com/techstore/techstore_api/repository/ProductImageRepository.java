package com.techstore.techstore_api.repository;

import com.techstore.techstore_api.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    // Récupérer les images d'un produit triées par ordre
    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);
}