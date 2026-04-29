import React from 'react';
import { Search, ListFilter, X, Calendar, UserCheck, Settings2, BarChart } from 'lucide-react';

const AdminFilter = ({ theme, onClose, categories, filters, setFilters, onReset, context = "products" }) => {
    
    // Détection du type d'interface pour adapter le langage 🧠
    const isUserContext = context === "users" || categories.includes("ADMIN");

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Unique */}
            <div className="flex justify-between items-center mb-8">
                <h3 className={`text-xl font-bold flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    <ListFilter size={20} className="text-indigo-500 mr-3" /> 
                    {isUserContext ? "Filtres Membres" : "Filtres Produits"}
                </h3>
                <button onClick={onClose} className="lg:hidden p-2 opacity-50"><X size={20}/></button>
            </div>

            {/* Zone de contenu scrollable */}
            <div className="space-y-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* 1. RECHERCHE (Adaptée au nom ou à l'email) */}
                <FilterGroup label="RECHERCHÉ">
                    <div className="relative group">
                        <Search className="absolute left-3 top-3.5 opacity-20 group-focus-within:text-indigo-500" size={14}/>
                        <input 
                            value={filters.searchTerm} 
                            onChange={e => setFilters({...filters, searchTerm: e.target.value})}
                            className={`w-full p-3.5 pl-10 rounded-2xl text-xs outline-none border transition-all ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white' : 'bg-gray-100 border-transparent text-slate-900'}`} 
                            placeholder={isUserContext ? "Nom, email, tel..." : "Nom, sku, marque..."} 
                        />
                    </div>
                </FilterGroup>

                {/* 2. CATÉGORIE / RÔLE ✨ */}
                <FilterGroup label={isUserContext ? "RÔLE SYSTÈME" : "CATÉGORIE"}>
                    <div className="relative">
                        <select 
                            value={filters.selCat} 
                            onChange={e => setFilters({...filters, selCat: e.target.value})}
                            className={`w-full p-3.5 rounded-2xl text-xs outline-none font-bold border appearance-none cursor-pointer ${theme === 'dark' ? 'bg-black/20 border-white/5 text-white' : 'bg-gray-100 border-transparent text-slate-900'}`}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Settings2 size={14} className="absolute right-4 top-4 opacity-20 pointer-events-none" />
                    </div>
                </FilterGroup>

                {/* 3. PRIX / FIDÉLITÉ ✨ */}
                <FilterGroup label={isUserContext ? "POINTS FIDÉLITÉ" : "FOURCHETTE DE PRIX"}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <input placeholder="Min" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})}
                                className={`w-full p-3.5 rounded-2xl text-xs outline-none border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-gray-100 border-transparent'}`} />
                        </div>
                        <div className="relative">
                            <input placeholder="Max" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                                className={`w-full p-3.5 rounded-2xl text-xs outline-none border ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-gray-100 border-transparent'}`} />
                        </div>
                    </div>
                </FilterGroup>

                {/* 4. DISPONIBILITÉ / ÉTAT DU COMPTE ✨ */}
                <FilterGroup label={isUserContext ? "VÉRIFICATION" : "DISPONIBILITÉ"}>
                    <div className={`p-1 flex rounded-xl ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-200'}`}>
                        {(isUserContext ? ["Tous", "Vérifiés", "Bannis"] : ["Tous", "En stock", "Épuisé"]).map(btn => (
                            <button 
                                key={btn} 
                                type="button" 
                                onClick={() => setFilters({...filters, dispo: btn})}
                                className={`flex-1 py-2.5 text-[9px] font-black rounded-xl transition-all ${filters.dispo === btn ? 'bg-[#6366f1] text-white shadow-lg' : 'opacity-30 hover:opacity-100'}`}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                </FilterGroup>

                {/* 5. DATE (Inscription ou Ajout) */}
                <FilterGroup label={isUserContext ? "DATE D'INSCRIPTION" : "DATE D'AJOUT"}>
                    <div className="space-y-3">
                        <div className="relative flex items-center">
                            <Calendar size={14} className="absolute right-4 opacity-20 pointer-events-none" />
                            <input type="date" className={`w-full p-3.5 rounded-2xl text-[10px] border outline-none ${theme === 'dark' ? 'bg-black/20 border-white/5 text-gray-500' : 'bg-gray-100 border-transparent'}`} />
                        </div>
                        <div className="relative flex items-center">
                            <Calendar size={14} className="absolute right-4 opacity-20 pointer-events-none" />
                            <input type="date" className={`w-full p-3.5 rounded-2xl text-[10px] border outline-none ${theme === 'dark' ? 'bg-black/20 border-white/5 text-gray-500' : 'bg-gray-100 border-transparent'}`} />
                        </div>
                    </div>
                </FilterGroup>
            </div>

            {/* Bouton de réinitialisation avec icône d'alerte discrète */}
            <div className="pt-6">
                <button 
                    onClick={onReset} 
                    className={`w-full py-4 text-[10px] font-black uppercase border rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center space-x-2 ${
                        theme === 'dark' 
                        ? 'border-white/5 text-slate-500 hover:text-white hover:bg-indigo-600/20' 
                        : 'bg-slate-800 text-white shadow-slate-300 hover:bg-slate-900'
                    }`}
                >
                    <BarChart size={14} />
                    <span>Réinitialiser les filtres</span>
                </button>
            </div>
        </div>
    );
};

const FilterGroup = ({ label, children }) => (
    <div className="space-y-3 group">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] block italic group-hover:text-indigo-500 transition-colors">
            {label}
        </label>
        {children}
    </div>
);

export default AdminFilter;