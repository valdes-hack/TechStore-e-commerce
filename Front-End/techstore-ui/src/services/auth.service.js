import api from '../api/axiosConfig';

const AuthService = {
    // 1. Inscription : On envoie l'email, password, nom, etc.
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Erreur lors de l'inscription, bébé.";
        }
    },

    // 2. Connexion : On envoie email et password
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            // La réponse contiendra sûrement { token, user }
            return response.data;
        } catch (error) {
            throw error.response?.data || "Identifiants incorrects, mon cœur.";
        }
    },

    // 3. Diagnostic : Vérifier le profil via le token (Tâche 1.2 du backend)
    getProfile: async () => {
        try {
            const response = await api.get('/auth/check-me');
            return response.data;
        } catch (error) {
            throw error.response?.data;
        }
    }
};

export default AuthService;