import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFilter from '../../components/admin/AdminFilter';
import StatCard from '../../components/admin/StatCard';
import AdminService from '../../services/admin.service';
import { ShoppingCart, Clock, CheckCircle2, DollarSign, Eye, Truck, RefreshCw, ChevronRight } from 'lucide-react';

const AdminOrders = () => {
    // 1. ÉTATS
    const [orders, setOrders] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme] = useState(() => localStorage.getItem('admin_hub_theme') || 'dark');
    
    // ÉTATS DES FILTRES
    const [filters, setFilters] = useState({ 
        searchTerm: "", 
        selCat: "Tous", // Statut
        dispo: "Tous" 
    });

    // 2. CHARGEMENT DES DONNÉES DEPUIS TON API ✨
    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await AdminService.getOrders();
            console.log("📥 DONNÉES ENTRANTES :", res);

            // LOGIQUE DE PARSING : On s'adapte au format de ton Swagger
            if (res && res.status === 'success' && res.data) {
                const orderData = Array.isArray(res.data) ? res.data : [];
                setOrders(orderData);
                setFilteredList(orderData);
                console.log(`✅ ${orderData.length} commandes chargées.`);
            }
        } catch (e) { 
            console.error("Erreur liaison backend :", e); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { loadOrders(); }, []);

    // 3. 🏆 FILTRAGE INSTANTANÉ
    useEffect(() => {
        const filtered = orders.filter(o => {
            const search = filters.searchTerm.toLowerCase();
            const orderRef = (o.orderNumber || o.id?.toString() || "").toLowerCase();
            const clientName = (o.userName || "").toLowerCase();
            const clientEmail = (o.userEmail || "").toLowerCase();

            const matchesSearch = orderRef.includes(search) || 
                                 clientName.includes(search) || 
                                 clientEmail.includes(search);
            
            const matchesStatus = filters.selCat === "Tous" || o.status === filters.selCat;
            
            return matchesSearch && matchesStatus;
        });
        setFilteredList(filtered);
    }, [orders, filters]);

    const statusList = ["Tous", "EN_ATTENTE", "PAYE", "EXPEDIE", "LIVRE", "ANNULE"];

    if (loading) return (
        <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0b0e14]' : 'bg-white'}`}>
            <RefreshCw className="animate-spin text-indigo-500 mr-3" />
            <span className="font-bold opacity-30 italic">TRAITEMENT DES FLUX...</span>
        </div>
    );

    return (
        <AdminLayout 
            theme={theme} 
            filters={
                <AdminFilter 
                    theme={theme} 
                    context="orders" 
                    categories={statusList} 
                    filters={filters} 
                    setFilters={setFilters} 
                    onReset={() => setFilters({searchTerm: "", selCat: "Tous", dispo: "Tous"})} 
                />
            }
        >
            <div className="space-y-10">
                <header className="flex justify-between items-center">
                    <h2 className={`text-4xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-[#1e293b]'}`}>
                        Gestion Commandes<span className="text-indigo-500">.</span>
                    </h2>
                </header>

                {/* 1. STATISTIQUES RÉELLES */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard 
                        theme={theme} 
                        title="REVENUS" 
                        value={(orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)).toLocaleString()} 
                        sub="CFA Brut" 
                        icon={<DollarSign/>} 
                        color="#10b981"
                    />
                    <StatCard 
                        theme={theme} 
                        title="EN ATTENTE" 
                        value={orders.filter(o => o.status === 'EN_ATTENTE').length} 
                        sub="Commandes" 
                        icon={<Clock/>} 
                        color="#fbbf24"
                    />
                    <StatCard 
                        theme={theme} 
                        title="EN CHEMIN" 
                        value={orders.filter(o => o.status === 'EXPEDIE').length} 
                        sub="Livraisons" 
                        icon={<Truck/>} 
                        color="#818cf8"
                    />
                    <StatCard 
                        theme={theme} 
                        title="TOTAL VENTES" 
                        value={orders.length} 
                        sub="Volume global" 
                        icon={<ShoppingCart/>} 
                        color="#f43f5e" 
                    />
                </div>

                {/* 2. TABLEAU DES VENTES */}
                <div className={`rounded-3xl border overflow-hidden shadow-2xl ${
                    theme === 'dark' ? 'bg-[#161926] border-white/5' : 'bg-white border-gray-100 shadow-slate-200'
                }`}>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className={`${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-slate-400'} text-[11px] font-black uppercase tracking-widest`}>
                                <tr className="border-b border-inherit">
                                    <th className="p-6">RÉFÉRENCE</th>
                                    <th className="p-6">CLIENT</th>
                                    <th className="p-6 text-center">MONTANT</th>
                                    <th className="p-6 text-center">STATUT</th>
                                    <th className="p-6 text-center">DATE</th>
                                    <th className="p-6 text-center">ACTES</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-20 text-center opacity-30 italic font-bold">
                                            Aucun mouvement dans cette section, mon Valdes. 🍎
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((o) => (
                                        <tr key={o.id} className="hover:bg-[#6366f1]/5 transition-all">
                                            <td className="p-6 font-mono text-xs text-indigo-400 font-bold">
                                                #{o.orderNumber || o.id}
                                            </td>
                                            <td className="p-6">
                                                <p className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                    {o.userName || 'Utilisateur'}
                                                </p>
                                                <p className="text-[10px] opacity-40">{o.userEmail || 'Client mystère'}</p>
                                            </td>
                                            <td className={`p-6 text-center font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                                                {(o.totalAmount || 0).toLocaleString()} F
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                                                    o.status === 'LIVRE' ? 'bg-green-500/10 text-green-500' : 
                                                    o.status === 'EN_ATTENTE' ? 'bg-yellow-500/10 text-yellow-500' : 
                                                    'bg-indigo-500/10 text-indigo-500'
                                                }`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-center opacity-40 text-[10px] font-bold">
                                                {o.createdAt ? o.createdAt.split('T')[0] : 'N/A'}
                                            </td>
                                            <td className="p-6 text-center">
                                                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl hover:border-indigo-500 hover:text-indigo-500 transition-all">
                                                    <Eye size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;