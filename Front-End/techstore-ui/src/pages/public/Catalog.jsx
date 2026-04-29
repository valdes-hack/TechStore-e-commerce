import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductService from '../../services/product.service';
import ProductCard from '../../components/product/ProductCard';
import { Search, SlidersHorizontal, Box, Sparkles } from 'lucide-react';

const Catalog = () => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [priceMax, setPriceMax] = useState(2500000);
    const [selectedBrand, setSelectedBrand] = useState("Toutes");
    const [localQuery, setLocalQuery] = useState(searchParams.get('q') || "");

    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            if (slug) {
                res = await ProductService.getByCategory(slug);
            } else {
                res = await ProductService.getAll(0, 100); 
            }

            if (res && res.status === 'success') {
                // Ta structure Spring : data -> content
                const list = res.data?.content || res.data || [];
                setProducts(Array.isArray(list) ? list : []);
            }
        } catch (err) {
            console.error("Erreur liaison", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [slug]);

    // Filtrage Multi-Critères en temps réel ! ✨
    const filteredProducts = products.filter(p => {
        const price = p.basePrice || 0;
        const nameMatch = p.name?.toLowerCase().includes(localQuery.toLowerCase());
        const brandMatch = p.brand?.toLowerCase().includes(localQuery.toLowerCase());
        const categoryMatch = selectedBrand === "Toutes" || p.brand === selectedBrand;
        
        return (nameMatch || brandMatch) && price <= priceMax && categoryMatch;
    });

    const brands = ["Toutes", ...new Set(products.map(p => p.brand).filter(b => b))];

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-apple-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-apple-dark/40 tracking-widest text-xs uppercase">Initialisation du Store...</p>
        </div>
    );

    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                
                {/* HEADER SEARCH */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter text-apple-dark capitalize italic">
                            {slug || 'Le Store'}<span className="text-apple-blue">.</span>
                        </h1>
                        <p className="text-apple-dark/40 font-bold mt-2">{filteredProducts.length} pépites disponibles.</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-apple-dark/20 group-focus-within:text-apple-blue transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher instantanément..." 
                            className="w-full bg-white border border-apple-border/50 rounded-3xl py-5 px-14 outline-none focus:ring-4 focus:ring-apple-blue/10 transition-all font-semibold"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* FILTRES SIDEBAR */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-apple-border/50 sticky top-32 shadow-sm space-y-10">
                            <h3 className="font-bold flex items-center border-b pb-4"><SlidersHorizontal size={18} className="mr-2" /> Paramètres</h3>
                            
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-apple-dark/40 mb-4 block">Prix Max : {new Intl.NumberFormat('fr-FR').format(priceMax)} F</label>
                                <input type="range" min="0" max="2500000" step="50000" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full accent-apple-blue cursor-pointer" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-apple-dark/40 mb-4 block">Choisir la Marque</label>
                                <select className="w-full bg-apple-gray border-none rounded-xl p-4 text-sm font-bold" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* RÉSULTATS */}
                    <main className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed">
                                <Box size={50} className="mx-auto text-apple-dark/10 mb-4" />
                                <p className="text-xl font-bold text-apple-dark/30">Désolé mon Valdes, ce produit est introuvable.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-700">
                                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Catalog;