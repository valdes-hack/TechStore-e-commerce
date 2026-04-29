🟢 PHASE 1 : LE SOCLE (Configuration & Sécurité)
C'est la fondation. Sans cela, rien ne fonctionne.

Tâche 1.1 : Configuration du pom.xml (Ajouter Spring Web, JPA, MySQL, Security, Lombok, Validation, JWT).

Tâche 1.2 : Configuration du application.properties (Connexion à techstore_db).

Tâche 1.3 : Création du modèle User (Entity) et de son UserRepository.

Tâche 1.4 : Création des DTOs d'authentification (RegisterRequest, LoginRequest, UserResponse).

Tâche 1.5 : Implémentation du AuthService (Logique d'inscription avec hachage de mot de passe).

Tâche 1.6 : Configuration de Spring Security (Désactivation CSRF, configuration des accès).

Tâche 1.7 : Implémentation du JWT (Génération du token, filtre de validation).

Tâche 1.8 : Création du AuthController et test des endpoints /register et /login sur Postman.
🔵 PHASE 2 : LE CATALOGUE (Produits & Catégories)
Permettre au client de voir ce qu'il peut acheter.

Tâche 2.1 : Création des modèles Category et Product.

Tâche 2.2 : Création des modèles ProductVariant et ProductImage.

Tâche 2.3 : Création des Repositories pour chaque modèle de cette phase.

Tâche 2.4 : Création du ProductResponse (DTO pour cacher le prix d'achat cost_price).

Tâche 2.5 : Implémentation du ProductService (Lecture avec pagination et filtres par catégorie).

Tâche 2.6 : Ajout de la recherche full-text dans ProductRepository (via @Query SQL).

Tâche 2.7 : Création du ProductController (Endpoints publics : /all, /{slug}, /search).

Tâche 2.8 : (Admin uniquement) Endpoints CRUD pour ajouter/modifier des produits.
🟡 PHASE 3 : PANIER & ADRESSES (L'Intention d'achat)
Gérer ce que l'utilisateur veut et où il veut être livré.

Tâche 3.1 : Création du modèle Address et son Repository.

Tâche 3.2 : Création du AddressController (CRUD pour les adresses du client connecté).

Tâche 3.3 : Création des modèles Cart et CartItem.

Tâche 3.4 : Implémentation du CartService (Ajouter, supprimer, modifier les quantités).

Tâche 3.5 : Logique de fusion du panier (Visiteur -> Client lors de la connexion).

Tâche 3.6 : Création du CartController (Endpoint /api/v1/cart).
🟠 PHASE 4 : COMMANDES & PAIEMENT (Le cœur métier)
Transformer le panier en vente réelle.

Tâche 4.1 : Création des modèles Order et OrderItem.

Tâche 4.2 : Implémentation du OrderService : Création de la commande.

Tâche 4.3 : APPEL PROCÉDURE : Faire en sorte que la commande appelle ta procédure SQL deduct_stock.

Tâche 4.4 : Création du modèle Payment adapté au Paiement Manuel.

Tâche 4.5 : Implémentation de l'envoi de preuve de paiement (Saisie du numéro de transaction Mobile Money).

Tâche 4.6 : Intégration de Spring Mail (Envoi automatique d'un email de confirmation de commande).

Tâche 4.7 : Création du OrderController pour le suivi client (/my-orders).
🔴 PHASE 5 : INTERACTIONS & IA (L'expérience premium)
Avis, Recommandations et Chatbot.

Tâche 5.1 : Création du modèle Review (Avis clients).

Tâche 5.2 : APPEL PROCÉDURE : Recalculer la note moyenne via update_product_rating après chaque avis.

Tâche 5.3 : Création du modèle Wishlist.

Tâche 5.4 : Algorithme de recommandation (IA légère) : "Produits similaires" basé sur la catégorie et le prix.

Tâche 5.5 : Pont API vers le serveur Rasa (Chatbot) pour le ChatController.

Tâche 5.6 : Système de notifications In-App (table notifications).
🟣 PHASE 6 : ADMINISTRATION (Le pilotage)
Gérer le magasin.

Tâche 6.1 : AdminDashboardController : Statistiques de vente (CA du jour, total commandes).

Tâche 6.2 : Gestion des commandes : Changement de statut (EN_PREPARATION -> EXPEDIE).

Tâche 6.3 : Gestion du SAV : Traitement des sav_tickets.