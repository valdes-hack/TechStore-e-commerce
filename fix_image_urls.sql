-- Script pour corriger les URLs localhost dans la base de données
-- Remplace localhost:8080 par l'URL de production

UPDATE product_images 
SET url = REPLACE(url, 'http://localhost:8080', 'https://techelectronic-api.onrender.com')
WHERE url LIKE 'http://localhost:8080%';

UPDATE categories 
SET image_url = REPLACE(image_url, 'http://localhost:8080', 'https://techelectronic-api.onrender.com')
WHERE image_url LIKE 'http://localhost:8080%';

SELECT 'Correction des URLs terminée' as status;
