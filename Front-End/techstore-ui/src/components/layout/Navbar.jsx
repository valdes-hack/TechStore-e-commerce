import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Package, LayoutDashboard, Users, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // On importe le cerveau du panier ✨
import ProductService from '../../services/product.service';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);

    const { isAuthenticated, user, isAdmin } = useAuth();
    const { setIsOpen, cart } = useCart(); // On récupère les contrôles du panier ✨
    const navigate = useNavigate();

    // 1. Détection du scroll pour l'effet transparent Apple
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Récupération des catégories réelles de ta base MySQL
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await ProductService.getCategories();
                if (res && res.data) setCategories(res.data);
            } catch (err) {
                console.error("Erreur catégories", err);
            }
        };
        fetchCats();
    }, []);

    // 3. GESTION DE LA RECHERCHE GÉNÉRALE
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed top-0 w-full z-[100] px-0 md:px-6 pt-0 md:pt-4 transition-all duration-500">
            <nav className={`mx-auto max-w-7xl transition-all duration-500 ${
                isScrolled 
                ? 'md:rounded-full bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg py-3 px-8' 
                : 'bg-transparent py-6 px-4'
            }`}>
                <div className="flex justify-between items-center gap-4">
                    
                    {/* LOGO */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-apple-dark rounded-xl flex items-center justify-center text-white">
                            <span className="font-bold text-xl italic">T</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-apple-dark hidden lg:block">
                            TechStore<span className="text-apple-blue">.</span>
                        </span>
                    </Link>

                    {/* MENU CENTRAL */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className="px-3 py-2 text-[13px] font-semibold text-apple-dark/70 hover:text-apple-blue transition-colors">Accueil</Link>
                        
                        <div 
                            className="relative group"
                            onMouseEnter={() => setIsProductsOpen(true)}
                            onMouseLeave={() => setIsProductsOpen(false)}
                        >
                            <button onClick={() => navigate('/catalog')} className="flex items-center space-x-1 px-3 py-2 text-[13px] font-semibold text-apple-dark/70 group-hover:text-apple-blue transition-colors">
                                <span>Produits</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isProductsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProductsOpen && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-apple-border/50 p-2 overflow-hidden"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-apple-dark/30 p-3 pb-1">Par Catégorie</p>
                                        {categories.map((cat) => (
                                            <Link key={cat.id} to={`/category/${cat.slug}`} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-apple-gray text-sm font-medium text-apple-dark/80 transition-all" onClick={() => setIsProductsOpen(false)}>
                                                <Package size={16} className="text-apple-blue/50" />
                                                <span>{cat.name}</span>
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ACCÈS ADMIN SÉCURISÉ */}
                        {isAdmin() && (
                            <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-apple-border/50">
                                <Link to="/admin/products" className="px-3 py-2 text-[13px] font-bold text-apple-dark/70 hover:text-apple-blue flex items-center">
                                    <Box size={14} className="mr-1" /> Stocks
                                </Link>
                                <Link to="/admin/users" className="px-3 py-2 text-[13px] font-bold text-apple-dark/70 hover:text-apple-blue flex items-center">
                                    <Users size={14} className="mr-1" /> Clients
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* BARRE DE RECHERCHE */}
                    <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm relative group">
                        <input type="text" placeholder="Chercher un produit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-apple-dark/5 border-none rounded-full py-2.5 px-11 text-xs font-medium focus:ring-4 focus:ring-apple-blue/10 outline-none transition-all" />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-apple-dark/30 group-focus-within:text-apple-blue" size={16} />
                    </form>

                    {/* ACTIONS */}
                    <div className="flex items-center space-x-2">
                        {/* CHANGEMENT ICI : button au lieu de Link pour ouvrir le CartDrawer ✨ */}
                        <button 
                            onClick={() => setIsOpen(true)}
                            className="p-2.5 rounded-full hover:bg-apple-dark/5 transition-all relative"
                        >
                            <ShoppingBag size={20} />
                            {cart.totalItems > 0 && (
                                <span className="absolute top-1 right-1 bg-apple-blue text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white animate-in zoom-in">
                                    {cart.totalItems}
                                </span>
                            )}
                        </button>

                        <Link to={isAuthenticated ? "/profile" : "/login"} 
                              className="flex items-center space-x-2 bg-apple-dark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-apple-blue transition-all">
                            <User size={14} />
                            <span className="hidden sm:block">{isAuthenticated ? (user?.firstName || "Compte") : "Connexion"}</span>
                        </Link>
                        
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-apple-dark">
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;