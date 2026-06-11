-- Script pour ajouter la colonne hero_image_url à la table app_settings
ALTER TABLE `app_settings` 
ADD COLUMN `hero_image_url` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL 
AFTER `logo_url`;
