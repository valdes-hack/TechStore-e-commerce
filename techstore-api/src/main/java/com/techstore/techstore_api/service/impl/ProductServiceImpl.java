package com.techstore.techstore_api.service.impl;

import com.techstore.techstore_api.dto.request.ProductRequest;
import com.techstore.techstore_api.dto.response.ProductImageResponse;
import com.techstore.techstore_api.dto.response.ProductResponse;
import com.techstore.techstore_api.dto.response.ProductVariantResponse;
import com.techstore.techstore_api.model.Category;
import com.techstore.techstore_api.model.Product;
import com.techstore.techstore_api.model.ProductImage;
import com.techstore.techstore_api.model.ProductVariant;
import com.techstore.techstore_api.repository.CategoryRepository;
import com.techstore.techstore_api.repository.ProductImageRepository;
import com.techstore.techstore_api.repository.ProductRepository;
import com.techstore.techstore_api.repository.ProductVariantRepository;
import com.techstore.techstore_api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::mapToProductResponse);
    }
    @Override
public ProductResponse getProductById(Long id) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));
    return mapToProductResponse(product); // On utilise la méthode de mapping qu'on a déjà écrite
}


    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable)
                .map(this::mapToProductResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        return mapToProductResponse(product);
    }

    /**
     * MÉTHODE DE MAPPING : Transforme l'entité Product en DTO ProductResponse
     */
    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .sku(product.getSku())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .brand(product.getBrand())
                .categoryName(product.getCategory().getName())
                .basePrice(product.getBasePrice())
                .discountPrice(product.getDiscountPrice())
                .ratingAvg(product.getRatingAvg())
                .stockQty(product.getStockQty())
                .specifications(product.getSpecifications())
                // Mapping des images
                .images(imageRepository.findByProductIdOrderBySortOrderAsc(product.getId()).stream()
                        .map(img -> ProductImageResponse.builder()
                                .id(img.getId()).url(img.getUrl())
                                .altText(img.getAltText()).isPrimary(img.isPrimary())
                                .build())
                        .collect(Collectors.toList()))
                // Mapping des variantes
                .variants(variantRepository.findByProductId(product.getId()).stream()
                        .map(v -> ProductVariantResponse.builder()
                                .id(v.getId()).skuVariant(v.getSkuVariant())
                                .price(v.getPrice()).stockQty(v.getStockQty())
                                .attributes(v.getAttributes())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
    @Override
@Transactional
public ProductResponse createProduct(ProductRequest request) {
    // 1. Trouver la catégorie
    Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));

    // 2. Créer et sauvegarder le produit
    Product product = Product.builder()
            .name(request.getName()).sku(request.getSku()).slug(request.getSlug())
            .description(request.getDescription()).brand(request.getBrand())
            .category(category).basePrice(request.getBasePrice())
            .discountPrice(request.getDiscountPrice()).costPrice(request.getCostPrice())
            .stockQty(request.getStockQty()).specifications(request.getSpecifications())
            .isActive(true).build();
    
    Product savedProduct = productRepository.save(product);

    // 3. Sauvegarder les images
    if (request.getImageUrls() != null) {
        request.getImageUrls().forEach(url -> {
            ProductImage img = ProductImage.builder()
                    .url(url).product(savedProduct).isPrimary(false).build();
            imageRepository.save(img);
        });
    }

    // 4. Sauvegarder les variantes
    if (request.getVariants() != null) {
        request.getVariants().forEach(vReq -> {
            ProductVariant variant = ProductVariant.builder()
                    .product(savedProduct).skuVariant(vReq.getSkuVariant())
                    .price(vReq.getPrice()).costPrice(vReq.getCostPrice())
                    .stockQty(vReq.getStockQty()).attributes(vReq.getAttributes())
                    .build();
            variantRepository.save(variant);
        });
    }

    return mapToProductResponse(savedProduct);
}
@Override
@Transactional
public ProductResponse updateProduct(Long id, ProductRequest request) {
    // 1. Chercher le produit existant
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id : " + id));

    // 2. Mettre à jour les champs de base
    product.setName(request.getName());
    product.setSku(request.getSku());
    product.setSlug(request.getSlug());
    product.setDescription(request.getDescription());
    product.setBrand(request.getBrand());
    product.setBasePrice(request.getBasePrice());
    product.setDiscountPrice(request.getDiscountPrice());
    product.setCostPrice(request.getCostPrice());
    product.setStockQty(request.getStockQty());
    product.setSpecifications(request.getSpecifications());

    // 3. Mettre à jour la catégorie si elle a changé
    if (!product.getCategory().getId().equals(request.getCategoryId())) {
        Category newCategory = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Nouvelle catégorie non trouvée"));
        product.setCategory(newCategory);
    }

    // Note : Pour simplifier cette étape, nous mettons à jour les infos de base.
    // La gestion complexe des images/variantes (ajouter/supprimer individuellement) 
    // pourra être affinée plus tard selon tes besoins.

    Product updatedProduct = productRepository.save(product);
    return mapToProductResponse(updatedProduct);
}

@Override
@Transactional
public void deleteProduct(Long id) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    
    // SOFT DELETE : On désactive le produit pour ne pas casser l'historique des ventes
    product.setActive(false);
    productRepository.save(product);
}
@Override
@Transactional(readOnly = true)
public Page<ProductResponse> getProductsByCategory(String categorySlug, Pageable pageable) {
    // 1. On cherche d'abord la catégorie par son slug
    Category category = categoryRepository.findBySlug(categorySlug)
            .orElseThrow(() -> new RuntimeException("Catégorie non trouvée : " + categorySlug));
    
    // 2. On récupère les produits liés à l'ID de cette catégorie
    return productRepository.findByCategoryIdAndIsActiveTrue(category.getId(), pageable)
            .map(this::mapToProductResponse);
}
}