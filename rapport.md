🚀 RAPPORT TECHNIQUE : BACKEND TECHSTORE (v1.0)
1. Présentation du Projet
Nom : TechStore
Concept : Plateforme E-commerce spécialisée en électronique pour le marché camerounais.
Stack : Java 17, Spring Boot 3.5, MySQL 8, Spring Security (JWT).
Philosophie : Architecture modulaire, 100% outils gratuits/open-source, sécurité maximale.
2. État d'avancement (Roadmap)
✅ Phase 1 (Socle) : Terminée (Auth, JWT, Sécurité).
✅ Phase 2 (Catalogue) : Terminée (Produits, Catégories, Variantes, Images, Recherche Full-text).
✅ Phase 3 (Espace Client) : Terminée (Gestion des adresses, Panier persistant).
⏳ Phase 4 (Commandes) : À venir (Logique de commande, Paiement manuel, Stocks).
3. Architecture Technique & Sécurité
Sécurité : Authentification Stateless via JWT. Les mots de passe sont hachés avec BCrypt.
Rôles : ROLE_CLIENT, ROLE_ADMIN, ROLE_SAV_AGENT.
Gestion des accès : Double protection via SecurityConfig (filtres d'URL) et annotations @PreAuthorize dans les contrôleurs.
DTO (Data Transfer Objects) : Utilisation systématique de DTOs pour masquer les données sensibles (ex: cost_price caché aux clients).
4. Base de Données (Points Clés)
Recherche : Index FULLTEXT sur la table products (colonnes name, description, brand) pour une recherche ultra-rapide via MATCH...AGAINST.
Intégrité : Utilisation du Soft Delete (is_active = 0) pour les produits et catégories afin de préserver l'historique des ventes.
Procédures Stockées : Présence de deduct_stock et add_stock dans MySQL pour garantir une gestion atomique des quantités lors des commandes.
Flexibilité : Stockage des spécifications techniques et attributs de variantes au format JSON (LongText).
5. Liste des APIs prêtes (Endpoints)
🔐 Authentification (/api/v1/auth)
POST /register : Inscription (BCrypt).
POST /login : Connexion (Génération JWT).
GET /check-me : Diagnostic des rôles.
📦 Catalogue Public (/api/v1/products)
GET / : Liste paginée des produits actifs.
GET /{slug} : Détail complet d'un produit.
GET /search?q=... : Recherche intelligente.
GET /category/{slug} : Filtrage par catégorie.
🏠 Espace Client (/api/v1/addresses & /api/v1/cart)
Adresses : CRUD complet avec support des coordonnées GPS (Latitude/Longitude).
Panier : Ajout, modification de quantité, suppression, calcul automatique du total, fusion panier visiteur/client.
🛠️ Administration (/api/v1/admin)
Produits/Catégories : CRUD complet (Créer, Modifier, Désactiver).
Utilisateurs : Liste des clients, blocage de compte, réinitialisation de mot de passe.
6. Éléments à fournir à la prochaine IA
Si tu veux qu'une IA continue le travail, donne-lui :
Ce rapport.
Ton fichier SQL complet (pour qu'elle comprenne les tables et procédures).
Le fichier SecurityConfig.java (pour qu'elle comprenne comment les routes sont protégées).
Le fichier ProductServiceImpl.java (pour qu'elle voie comment tu gères le mapping et les variantes).
