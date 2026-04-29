import api from '../api/axiosConfig';

const AddressService = {
    // 1. Lister les adresses du client (GET /api/v1/addresses)
    getMyAddresses: async () => {
        try {
            const response = await api.get('addresses');
            return response.data; // Renvoie { status, data: [...] }
        } catch (error) {
            console.error("Erreur lecture adresses", error);
            throw error;
        }
    },

    // 2. Ajouter une adresse (POST /api/v1/addresses)
    addAddress: async (addressData) => {
        try {
            const response = await api.post('addresses', addressData);
            return response.data;
        } catch (error) {
            console.error("Erreur création adresse", error);
            throw error;
        }
    },

    // 3. Supprimer (DELETE /api/v1/addresses/{id})
    deleteAddress: async (id) => {
        const response = await api.delete(`addresses/${id}`);
        return response.data;
    }
};

export default AddressService;