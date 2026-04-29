import api from '../api/axiosConfig';

const OrderService = {
    // Créer la commande
    createOrder: async (orderData) => {
        const response = await api.post('orders', orderData);
        return response.data; // Renvoie { status: "success", data: { id: ... } }
    },

    // Voir mes commandes (Client)
    getMyOrders: async () => {
        const response = await api.get('orders');
        return response.data; // Renvoie { status: "success", data: [...] }
    }
};

export default OrderService;