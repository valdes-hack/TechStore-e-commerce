🎨 CAHIER DES CHARGES FRONTEND : TECHSTORE (Style Apple)
1. Identité Visuelle & Design System (L'ADN Apple)
L'objectif est d'avoir une interface épurée où le produit est la star.
Palette de couleurs :
Fond : Blanc pur (#FFFFFF) ou Gris très clair (#F5F5F7).
Texte : Noir profond (#1D1D1F) pour les titres, Gris foncé (#86868B) pour les descriptions.
Accent : Bleu électrique (#0066CC) pour les boutons d'action et liens.
Dark Mode : Noir OLED (#000000) avec des cartes gris anthracite.
Typographie : Utilisation de la police Inter ou SF Pro (si possible). Texte aéré, interligne généreux.
Composants UI :
Bords très arrondis (Radius : 18px à 22px).
Glassmorphism : Effet de verre dépoli sur la barre de navigation (Blur).
Ombres portées : Très légères et diffuses (Soft Shadows).
2. Structure des Pages (Expérience Utilisateur)
A. Page d'Accueil (Le "Wow" Effect)
Hero Section : Une image de produit géante (ex: le dernier iPhone) avec un titre percutant et une animation d'entrée en fondu.
Bento Grid : Une grille moderne présentant les catégories (Smartphones, Laptops, Gaming) avec des tailles de boîtes différentes.
Section "Tendances" : Un slider horizontal ultra-fluide.
B. Le Catalogue (Clarté & Filtres)
Grille de produits : Cartes minimalistes. Au survol (hover), l'image zoome légèrement et le bouton "Ajouter au panier" apparaît en fondu.
Filtres intelligents : Une barre latérale qui s'ouvre en "Drawer" sur mobile. Filtres par prix (slider), marque et disponibilité.
Skeleton Screens : Affichage de formes grises animées pendant le chargement des produits (pas de "Loading..." moche).
C. Fiche Produit (L'Immersion)
Galerie interactive : Grandes photos avec zoom au clic.
Sélecteur de variantes : Boutons circulaires pour les couleurs, boutons "pilules" pour la RAM/Stockage.
Sticky Bar : Sur mobile, le bouton "Acheter" reste fixé en bas de l'écran.
D. Le Panier & Checkout (Fluidité)
Side Cart : Le panier s'ouvre sur le côté droit sans recharger la page.
Stepper de commande : Un tunnel en 3 étapes (Adresse -> Livraison -> Paiement) avec une barre de progression fine.
3. Fonctionnalités Avancées (Le "Lourd")
Animations (Framer Motion) : Transitions de pages fluides, éléments qui apparaissent au défilement (Scroll Reveal).
Recherche Prédictive : Dès que l'utilisateur tape une lettre, les résultats s'affichent avec des miniatures d'images.
PWA (Progressive Web App) : Le site peut être "installé" sur le téléphone du client comme une application native.
Gestion du Token : Stockage sécurisé du JWT dans le localStorage ou Cookies avec déconnexion automatique si le token expire.
4. Stack Technique Recommandée
Framework : React JS (avec Vite pour la rapidité).
Styling : Tailwind CSS (indispensable pour le design moderne et rapide).
Animations : Framer Motion (pour l'effet Apple).
Icônes : Lucide React (icônes fines et élégantes).
Gestion d'état : Context API (pour le panier et l'utilisateur) ou Redux Toolkit.
Appels API : Axios avec un intercepteur pour ajouter automatiquement le Token JWT.
5. Interface Administration (Dashboard Pro)
L'admin ne doit pas être délaissé. Il lui faut un style "SaaS" moderne :
Sidebar : Navigation latérale sombre ou blanche épurée.
Graphiques : Utilisation de Recharts pour afficher l'évolution du chiffre d'affaires (courbes fines).
Tables : Listes de produits avec badges de couleur pour les statuts (En stock = Vert, Rupture = Rouge).