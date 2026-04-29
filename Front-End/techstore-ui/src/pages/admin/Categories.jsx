import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminFilter from '../../components/admin/AdminFilter';
import StatCard from '../../components/admin/StatCard';
import AdminService from '../../services/admin.service';
import CategoryForm from './CategoryForm';
import { Layers, Plus, Edit2, Trash2, FolderTree, RefreshCw, ChevronRight } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(() => localStorage.getItem('admin_hub_theme') || 'dark');
    
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filters, setFilters] = useState({ searchTerm: "", selCat: "Tous", dispo: "Tous" });

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await AdminService.getAllAdminCategories();
            if (res.status === 'success') {
                setCategories(res.data || []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    // Filtrage
    useEffect(() => {
        const filtered = categories.filter(c => 
            c.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
        setFilteredList(filtered);
    }, [categories, filters]);

    const handleDelete = async (id) => {
        if(window.confirm("Bébé, on désactive ce rayon ? Les produits seront orphelins ! 🙈")) {
            await AdminService.deleteCategory(id);
            loadData();
        }
    };

    const handleSave = async (data) => {
        if (selectedCategory) await AdminService.updateCategory(selectedCategory.id, data);
        else await AdminService.createCategory(data);
        loadData();
        setShowForm(false);
    };

    if (loading) return <div className="h-screen flex items-center justify-center animate-spin text-indigo-500 font-bold">CHARGEMENT DES RAYONS...</div>;

    return (
        <AdminLayout 
            theme={theme} toggleTheme={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
            filters={<AdminFilter theme={theme} categories={["Tous"]} filters={filters} setFilters={setFilters} onReset={() => setFilters({searchTerm: "", selCat: "Tous", dispo: "Tous"})} />}
        >
            <div className="space-y-10">
                <header className="flex justify-between items-center">
                    <h2 className={`text-4xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Configuration Rayons.</h2>
                    <button onClick={() => { setSelectedCategory(null); setShowForm(true); }} className="bg-[#6366f1] text-white px-6 py-3 rounded-2xl font-black hover:scale-105 shadow-lg">
                        + NOUVEAU RAYON
                    </button>
                </header>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard theme={theme} title="TOTAL CATÉGORIES" value={categories.length} sub="Arborescence complète" icon={<Layers/>} color="#818cf8"/>
                    <StatCard theme={theme} title="SECTIONS RACINES" value={categories.filter(c=>!c.parentId).length} sub="Rayons principaux" icon={<FolderTree/>} color="#10b981"/>
                </div>

                {/* TABLEAU */}
                <div className={`rounded-3xl border overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#161926] border-white/5' : 'bg-white border-gray-100 shadow-xl'}`}>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className={`${theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-slate-400'} text-[11px] font-black uppercase tracking-widest`}>
                                <tr className="border-b border-inherit">
                                    <th className="p-6">ID</th>
                                    <th className="p-6">ICÔNE</th>
                                    <th className="p-6">NOM DU RAYON</th>
                                    <th className="p-6">URL SLUG</th>
                                    <th className="p-6 text-center">TYPE</th>
                                    <th className="p-6 text-center">ACTES</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {filteredList.map((c) => (
                                    <tr key={c.id} className="hover:bg-[#6366f1]/5 transition-all group">
                                        <td className="p-6 font-mono text-xs opacity-40">#{c.id}</td>
                                        <td className="p-6">
                                            <div className={`w-12 h-12 rounded-xl p-2 border border-white/5 ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-100'}`}>
                                                <img src={c.iconUrl || 'https://placehold.co/50?text=C'} className="w-full h-full object-contain" />
                                            </div>
                                        </td>
                                        <td className={`p-6 font-black text-lg ${theme==='dark'?'text-white':'text-slate-800'}`}>{c.name}</td>
                                        <td className="p-6 font-mono text-xs text-indigo-400">/{c.slug}</td>
                                        <td className="p-6 text-center">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${c.parentId ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'}`}>
                                                {c.parentId ? 'SOUS-RAYON' : 'PRINCIPAL'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center space-x-2">
                                            <button onClick={() => { setSelectedCategory(c); setShowForm(true); }} className="p-2.5 rounded-xl border border-white/5 text-indigo-400 hover:bg-indigo-400 hover:text-white transition-all"><Edit2 size={16}/></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2.5 rounded-xl border border-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showForm && (
                <CategoryForm category={selectedCategory} categories={categories} onClose={() => setShowForm(false)} onSave={handleSave} theme={theme} />
            )}
        </AdminLayout>
    );
};

export default AdminCategories;