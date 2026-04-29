import api from '../api/axiosConfig';

const AdminService = {
    
    // ==========================================
    // 👤 GESTION DES UTILISATEURS (Admin)
    // ==========================================

    // Récupérer la liste de tous les membres
    getUsers: async () => {
        const response = await api.get('admin/users');
        return response.data;
    },

    // Mettre à jour un utilisateur (Prénom, Nom, Rôle...)
    updateUser: async (id, userData) => {
        const response = await api.put(`admin/users/${id}`, userData);
        return response.data;
    },

    // Activer / Bloquer un utilisateur (Le bouton Toggle ✨)
    toggleUserStatus: async (id) => {
        const response = await api.patch(`admin/users/${id}/toggle-status`);
        return response.data;
    },

    // Réinitialiser le mot de passe d'un utilisateur
    resetUserPassword: async (id, newPassword) => {
        const response = await api.patch(`admin/users/${id}/reset-password`, { newPassword });
        return response.data;
    },

    // Supprimer un membre
    deleteUser: async (id) => {
        const response = await api.delete(`admin/users/${id}`);
        return response.data;
    },

    // ==========================================
    // 📦 GESTION DES PRODUITS (Admin)
    // ==========================================

    // Voir tout l'inventaire
    getAdminProducts: async () => {
        const response = await api.get('admin/products');
        return response.data;
    },

    // CRÉER un produit avec images (MULTIPART ✨)
    createProduct: async (productData, files) => {
        const formData = new FormData();
        
        // Emballage du JSON du produit
        formData.append('product', new Blob([JSON.stringify(productData)], {
            type: 'application/json'
        }));

        // Ajout des fichiers images
        if (files && files.length > 0) {
            files.forEach(file => {
                formData.append('files', file);
            });
        }

        const response = await api.post('admin/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Modifier un produit existant
    updateProduct: async (id, productData) => {
        const response = await api.put(`admin/products/${id}`, productData);
        return response.data;
    },

    // Désactiver / Supprimer un produit (Soft Delete)
    deleteProduct: async (id) => {
        const response = await api.delete(`admin/products/${id}`);
        return response.data;
    },

    // ==========================================
    // 🧾 GESTION DES COMMANDES (Admin)
    // ==========================================

    // Voir toutes les ventes de TechStore// Dans src/services/admin.service.js
getOrders: async () => {
    try {
        const response = await api.get('admin/orders');
        console.log("📡 API Admin Orders brute :", response); // On vérifie l'envoi
        return response.data; // On doit renvoyer uniquement les données !
    } catch (error) {
        throw error;
    }
},

    // Changer le statut d'une commande (ex: EN_ATTENTE -> LIVRE)
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`admin/orders/${orderId}/status?status=${status}`);
        return response.data;
    },
    getAllAdminCategories: async () => {
        const response = await api.get('admin/categories');
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('admin/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`admin/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`admin/categories/${id}`);
        return response.data;
    }
};

export default AdminService;