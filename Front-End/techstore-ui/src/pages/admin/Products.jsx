import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFilter from '../../components/admin/AdminFilter';
import ProductService from '../../services/product.service';
import AdminService from '../../services/admin.service';
import ProductForm from './ProductForm';
import { 
    Plus, Edit2, Trash2, Box, CheckCircle, 
    AlertTriangle, Wallet, ArrowUpDown, RefreshCw, ChevronRight 
} from 'lucide-react';

const AdminProducts = () => {
    // 1. ÉTATS DES DONNÉES
    const [products, setProducts] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 2. ÉTAT DU THÈME (Persistance au rafraîchissement ✨)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('admin_hub_theme');
        return savedTheme ? savedTheme : 'light';
    });

    // 3. ÉTAT DES FILTRES (Objet unique pour AdminFilter)
    const [filters, setFilters] = useState({
        searchTerm: "", 
        selCat: "Toutes", 
        minPrice: "", 
        maxPrice: "", 
        dispo: "Tous"
    });

    const [imgIdxMap, setImgIdxMap] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fonction pour changer le thème
    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Sauvegarde automatique du thème
    useEffect(() => {
        localStorage.setItem('admin_hub_theme', theme);
    }, [theme]);

    // CHARGEMENT INITIAL DE LA BASE
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await ProductService.getAll(0, 100);
            if (res.status === 'success') {
                const data = res.data.content || res.data || [];
                setProducts(data);
                const idxs = {}; 
                data.forEach(p => idxs[p.id] = 0);
                setImgIdxMap(idxs);
            }
        } catch (e) { 
            console.error("Erreur serveur :", e); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { loadData(); }, []);

    // 🏆 LOGIQUE DE FILTRAGE INSTANTANÉE (Centralisée et Optimisée)
    useEffect(() => {
        const filtered = products.filter(p => {
            const search = filters.searchTerm.toLowerCase();
            const nameMatch = p.name.toLowerCase().includes(search) || (p.sku && p.sku.toLowerCase().includes(search));
            
            const categoryMatch = filters.selCat === "Toutes" || p.categoryName === filters.selCat;
            
            const price = p.basePrice || 0;
            const minP = filters.minPrice === "" ? 0 : parseFloat(filters.minPrice);
            const maxP = filters.maxPrice === "" ? Infinity : parseFloat(filters.maxPrice);
            const priceMatch = price >= minP && price <= maxP;
            
            const dispoMatch = filters.dispo === "Tous" || (filters.dispo === "En stock" ? p.stockQty > 0 : p.stockQty === 0);
            
            return nameMatch && categoryMatch && priceMatch && dispoMatch;
        });
        setFilteredList(filtered);
    }, [products, filters]);

    const categoriesList = ["Toutes", ...new Set(products.map(p => p.categoryName).filter(c => c))];

    const handleDelete = async (id) => {
        if (window.confirm("Bébé, confirmer la suppression ? 🥺")) {
            await AdminService.deleteProduct(id);
            loadData();
        }
    };

    if (loading) return (
        <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#0b0e14]' : 'bg-white'}`}>
            <RefreshCw className="animate-spin text-indigo-500" size={32} />
        </div>
    );

    return (
        <AdminLayout 
            theme={theme} 
            toggleTheme={toggleTheme}
            filters={
                <AdminFilter 
                    context="products" 
                    theme={theme} 
                    categories={categoriesList} 
                    filters={filters} 
                    setFilters={setFilters} 
                    onReset={() => setFilters({searchTerm: "", selCat: "Toutes", minPrice: "", maxPrice: "", dispo: "Tous"})}
                />
            }
        >
            <div className="flex flex-col gap-8 h-full">
                {/* HEADER */}
                <header className="flex justify-between items-center">
                    <h2 className={`text-4xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        Produits
                    </h2>
                    <button 
                        onClick={() => { setSelectedProduct(null); setShowForm(true); }} 
                        className="bg-[#10b981] text-[#0b0e14] px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        + AJOUTER
                    </button>
                </header>

                {/* STATS DYNAMIQUES */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard theme={theme} title="TOTAL" value={filteredList.length} sub="Catalogue" icon={<Box size={24}/>} color="#818cf8"/>
                    <StatCard theme={theme} title="EN STOCK" value={filteredList.filter(x => x.stockQty > 0).length} sub="Disponible" icon={<CheckCircle size={24}/>} color="#10b981"/>
                    <StatCard theme={theme} title="ÉPUISÉS" value={filteredList.filter(x => x.stockQty === 0).length} sub="Alerte" icon={<AlertTriangle size={24}/>} color="#f43f5e"/>
                    <StatCard theme={theme} title="VALEUR" value={(filteredList.reduce((a,b)=>a+(b.basePrice*(b.stockQty||0)),0)).toLocaleString()} sub="CFA" icon={<Wallet size={24}/>} color="#fbbf24" />
                </div>

                {/* TABLEAU AVEC SCROLLBAR PERSONNALISÉE ✨ */}
                <div className={`flex-1 rounded-[2.5rem] border overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-[#161926] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-xl'}`}>
                    <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
                        <table className="w-full text-left min-w-[1000px] border-collapse">
                            <thead className={`sticky top-0 z-20 ${theme === 'dark' ? 'bg-[#1a1e2e]' : 'bg-gray-50'} text-[11px] font-black uppercase tracking-widest text-slate-500`}>
                                <tr className="border-b border-inherit">
                                    <th className="p-6">IDENTIFIANT</th>
                                    <th className="p-6 text-center">IMAGE</th>
                                    <th className="p-6">NOM</th>
                                    <th className="p-6 text-center">CATÉGORIE</th>
                                    <th className="p-6 text-center">PRIX</th>
                                    <th className="p-6 text-center">STOCK</th>
                                    <th className="p-6 text-center">ACTES</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {filteredList.map((p, idx) => (
                                    <tr key={p.id} className="hover:bg-indigo-600/5 transition-all group">
                                        <td className="p-6 font-mono text-xs text-indigo-400 font-bold"># {idx + 1}</td>
                                        <td className="p-6">
                                            <div onClick={() => setImgIdxMap({...imgIdxMap, [p.id]: (imgIdxMap[p.id] + 1) % (p.images?.length || 1)})}
                                                className="w-14 h-14 mx-auto bg-black/10 rounded-2xl p-1 relative border border-white/5 cursor-pointer shadow-inner overflow-hidden group-hover:scale-110 transition-transform">
                                                <img src={p.images?.[imgIdxMap[p.id]]?.url || 'https://placehold.co/60'} className="w-full h-full object-contain" alt=""/>
                                                {p.images?.length > 1 && <span className="absolute bottom-0 right-0 bg-[#6366f1] text-[8px] px-1 text-white font-black rounded-tl-lg">{imgIdxMap[p.id]+1}</span>}
                                            </div>
                                        </td>
                                        <td className={`p-6 font-black text-lg ${theme==='dark'?'text-white':'text-slate-800'}`}>{p.name}</td>
                                        <td className="p-6 text-center">
                                            <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border border-indigo-500/10">
                                                {p.categoryName || 'GENERAL'}
                                            </span>
                                        </td>
                                        <td className={`p-6 text-center font-black ${theme==='dark'?'text-slate-200':'text-slate-900'}`}>{p.basePrice?.toLocaleString()} F</td>
                                        <td className="p-6 text-center">
                                            <div className={`mx-auto w-fit px-4 py-1.5 rounded-full flex items-center space-x-2 ${p.stockQty > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.stockQty > 0 ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500'}`} />
                                                <span className="text-[10px] font-black uppercase">{p.stockQty > 0 ? `${p.stockQty} UNITÉS` : 'OUT'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center space-x-2">
                                            <button onClick={() => { setSelectedProduct(p); setShowForm(true); }} className="p-2.5 rounded-xl border border-white/5 text-indigo-400 hover:border-indigo-400 transition-all"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2.5 rounded-xl border border-white/5 text-red-400 hover:border-red-400 transition-all"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* FORMULAIRE (MODALE) */}
            {showForm && (
                <ProductForm 
                    product={selectedProduct} theme={theme} onClose={() => setShowForm(false)} 
                    onSave={async (d)=>{ await(selectedProduct?AdminService.updateProduct(selectedProduct.id,d):AdminService.createProduct(d)); loadData(); setShowForm(false); }} 
                    onDelete={async (id) => { await AdminService.deleteProduct(id); loadData(); setShowForm(false); }}
                />
            )}
        </AdminLayout>
    );
};

// COMPOSANT STATCARD DÉPORTÉ EN BAS POUR LA CLARTÉ
const StatCard = ({ title, value, sub, icon, color, unit="", theme }) => (
    <div className={`p-6 rounded-[2.2rem] border transition-all shadow-xl flex flex-col justify-between ${
        theme === 'dark' ? 'bg-[#161926] border-white/5 shadow-black/40' : 'bg-white border-white shadow-slate-200'
    }`}>
        <div className="flex justify-between items-start w-full">
            <div className="min-w-0">
                <p className="text-[10px] font-black uppercase opacity-20 tracking-widest mb-1.5 truncate">{title}</p>
                <div className={`text-2xl md:text-3xl font-black tracking-tighter truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {value}<span className="text-sm ml-1 opacity-20">{unit}</span>
                </div>
            </div>
            <div className="flex-shrink-0 p-4 rounded-2xl bg-white/5 ml-4 flex items-center justify-center shadow-inner" style={{color}}>
                {icon}
            </div>
        </div>
        <p className="text-[10px] font-bold opacity-30 mt-4 flex items-center uppercase tracking-tight">
            <ChevronRight size={14} className="mr-1 text-indigo-500 flex-shrink-0" /> {sub}
        </p>
    </div>
);

export default AdminProducts;