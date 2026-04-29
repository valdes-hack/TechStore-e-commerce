📘 Documentation API TechStore v1.0
Base URL : http://localhost:8080
Format des données : JSON
Sécurité : Bearer Token (JWT) pour les routes protégées.
🔐 1. Module Authentification & Sécurité
C'est le moteur qui gère l'accès au système. Il transforme un visiteur en client ou en administrateur.
Méthode	Endpoint	Description	Logique & Utilité
POST	/api/v1/auth/register	Inscription client	Crée un compte CLIENT par défaut. Le mot de passe est haché (BCrypt) avant d'entrer en base de données.
POST	/api/v1/auth/login	Connexion	Vérifie les identifiants et génère un Token JWT. Ce token est le "badge" à envoyer dans le header pour les autres APIs.
GET	/api/v1/auth/check-me	Diagnostic	Permet de vérifier en temps réel quel rôle (ROLE_ADMIN ou ROLE_CLIENT) est associé au Token envoyé.
📦 2. Module Catalogue (Public)
Ces APIs sont accessibles par tout le monde, même sans être connecté. Elles servent à afficher la boutique.
Méthode	Endpoint	Description	Logique & Utilité
GET	/api/v1/products	Liste des produits	Affiche les produits actifs. Utilise la pagination pour ne pas ralentir le site. Cache le prix d'achat (cost_price).
GET	/api/v1/products/{slug}	Fiche produit	Affiche les détails complets d'un produit (images, variantes, specs) via son nom simplifié (slug).
GET	/api/v1/products/search	Recherche intelligente	Utilise le moteur Full-Text MySQL pour trouver des produits par nom, marque ou description.
GET	/api/v1/products/category/{slug}	Filtre catégorie	Affiche uniquement les produits appartenant à une catégorie précise.
🛒 3. Module Espace Client (Privé)
Nécessite un Token JWT. Ces APIs gèrent les données personnelles du client.
A. Gestion des Adresses
Méthode	Endpoint	Description	Logique & Utilité
POST	/api/v1/addresses	Ajouter une adresse	Enregistre un lieu de livraison. Gère l'adresse "par défaut" (une seule à la fois).
GET	/api/v1/addresses	Mes adresses	Liste uniquement les adresses de l'utilisateur connecté.
PUT	/api/v1/addresses/{id}	Modifier	Met à jour une adresse existante.
DELETE	/api/v1/addresses/{id}	Supprimer	Efface une adresse de la base de données.
B. Gestion du Panier (Cart)
Méthode	Endpoint	Description	Logique & Utilité
GET	/api/v1/cart	Voir mon panier	Calcule en temps réel le Total Amount et liste les articles avec leurs variantes.
POST	/api/v1/cart/add	Ajouter un article	Ajoute un produit au panier. Si l'article existe déjà, il augmente simplement la quantité.
PUT	/api/v1/cart/update/{itemId}	Modifier quantité	Change la quantité d'une ligne du panier (ex: passer de 1 à 3 iPhones).
DELETE	/api/v1/cart/remove/{itemId}	Retirer un article	Enlève un produit spécifique du panier.
🛠️ 4. Module Administration (Privé - ROLE_ADMIN)
Ces APIs sont le "tableau de bord" du propriétaire. Elles permettent de piloter tout le site.
A. Gestion du Catalogue (CRUD)
Méthode	Endpoint	Description	Logique & Utilité
POST	/api/v1/admin/products	Créer un produit	Ajoute un produit avec ses images et ses variantes en une seule fois.
PUT	/api/v1/admin/products/{id}	Modifier produit	Change les prix, les stocks ou les descriptions.
DELETE	/api/v1/admin/products/{id}	Désactiver	Applique un Soft Delete : le produit reste en BD pour les stats mais disparaît du site client.
POST/PUT	/api/v1/admin/categories	Gérer catégories	Permet de créer ou modifier l'arborescence du magasin.
B. Gestion des Utilisateurs
Méthode	Endpoint	Description	Logique & Utilité
GET	/api/v1/admin/users	Liste des clients	Affiche tous les inscrits pour analyse ou gestion.
PATCH	/api/v1/admin/users/{id}/toggle-status	Bloquer/Débloquer	Permet de désactiver le compte d'un utilisateur (ex: fraude ou mauvais comportement).
PATCH	/api/v1/admin/users/{id}/reset-password	Réinitialiser Pass	L'admin peut forcer un nouveau mot de passe si le client a perdu ses accès.
💡 Résumé de la Logique Métier appliquée :
Sécurité "Double Verrou" : L'accès est protégé par le fichier SecurityConfig (le couloir) et par les annotations dans les contrôleurs (la porte de la pièce).
Confidentialité des prix : Le cost_price (prix d'achat) est stocké en base de données mais n'est jamais envoyé aux clients via les DTOs.
Intégrité des données : On utilise le Soft Delete (is_active = 0) pour ne jamais casser l'historique des commandes passées.
Performance : La recherche utilise les index Full-Text de MySQL pour être instantanée, même avec des milliers d'articles.