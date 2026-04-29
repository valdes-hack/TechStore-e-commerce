http://localhost:8080/api/v1/auth/login

{
    "email": "admin@techstore.com",
    "password": "password123"
}
http://localhost:8080/api/v1/admin/categories
{
    "name": "Ordinateurs Portables",
    "slug": "laptops",
    "isActive": true
}

token
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkB0ZWNoc3RvcmUuY29tIiwiaWF0IjoxNzc1OTkyODkwLCJleHAiOjE3NzYwNzkyOTB9.12N2UAjS3creuYIUgsgl_ptGPT8KRZogSp_M_1gRpZI

http://localhost:8080/api/v1/admin/products
{
    "name": "iPhone 16 Pro",
    "sku": "IPH15-PRO-V2",
    "slug": "iphone-16-pro",
    "description": "Le dernier iPhone de Apple",
    "brand": "Apple",
    "categoryId": 1, 
    "basePrice": 850000,
    "costPrice": 700000,
    "stockQty": 10,
    "imageUrls": ["https://image1.jpg", "https://image2.jpg"],
    "variants": [
        {
            "skuVariant": "IPH15-PRO-BLK",
            "price": 850000,
            "stockQty": 5,
            "attributes": "{\"Couleur\": \"Noir\"}"
        }
    ]
}