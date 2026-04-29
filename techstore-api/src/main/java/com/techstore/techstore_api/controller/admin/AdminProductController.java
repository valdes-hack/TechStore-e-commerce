package com.techstore.techstore_api.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techstore.techstore_api.dto.request.ProductRequest;
import com.techstore.techstore_api.dto.response.ApiResponse;
import com.techstore.techstore_api.dto.response.ProductResponse;
import com.techstore.techstore_api.service.FileStorageService;
import com.techstore.techstore_api.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper; // Pour convertir le texte JSON en objet Java

    /**
     * 1. LISTER TOUS LES PRODUITS (ADMIN)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAllForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getAllProducts(pageable); 
        
        return ResponseEntity.ok(ApiResponse.<Page<ProductResponse>>builder()
                .status("success").code(200).message("Liste complète récupérée")
                .timestamp(LocalDateTime.now()).data(products).build());
    }

    /**
     * 2. VOIR LE DÉTAIL D'UN PRODUIT
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.<ProductResponse>builder()
                .status("success").code(200).message("Détail récupéré")
                .timestamp(LocalDateTime.now()).data(response).build());
    }

    /**
     * 3. CRÉER UN PRODUIT AVEC IMAGES (UPLOAD LOCAL)
     * Reçoit le JSON sous forme de String ("product") et les fichiers ("files")
     */
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestPart("product") String productJson, 
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        
        try {
            // 1. Conversion manuelle du String JSON en objet ProductRequest
            ProductRequest request = objectMapper.readValue(productJson, ProductRequest.class);

            // 2. Enregistrement des fichiers sur le disque local
            if (files != null && !files.isEmpty()) {
                List<String> imageUrls = files.stream()
                        .map(file -> {
                            String fileName = fileStorageService.storeFile(file);
                            // Génère l'URL accessible via le navigateur
                            return "http://localhost:8080/uploads/products/" + fileName;
                        })
                        .collect(Collectors.toList());
                request.setImageUrls(imageUrls);
            }

            // 3. Appel du service pour enregistrer en base de données
            ProductResponse response = productService.createProduct(request);
            
            return ResponseEntity.status(201).body(ApiResponse.<ProductResponse>builder()
                    .status("success")
                    .code(201)
                    .message("Produit créé avec succès")
                    .timestamp(LocalDateTime.now())
                    .data(response)
                    .build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(ApiResponse.<ProductResponse>builder()
                    .status("error")
                    .code(500)
                    .message("Erreur lors de la création : " + e.getMessage())
                    .timestamp(LocalDateTime.now())
                    .build());
        }
    }

    /**
     * 4. MODIFIER UN PRODUIT
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable Long id, 
            @Valid @RequestBody ProductRequest request) {
        
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.<ProductResponse>builder()
                .status("success").code(200).message("Produit mis à jour")
                .timestamp(LocalDateTime.now()).data(response).build());
    }

    /**
     * 5. SUPPRIMER UN PRODUIT (SOFT DELETE)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status("success").code(200).message("Produit désactivé")
                .timestamp(LocalDateTime.now()).build());
    }
}