import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Laptop, Smartphone, Headphones, Gamepad2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ProductService from '../../services/product.service';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 1. Détecter le scroll pour l'effet de transparence Apple
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Charger tes VRAIES catégories depuis ton API Spring Boot
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await ProductService.getCategories();
                // Ton format JSON : { status: 'success', data: [...] }
                if (res && res.data) {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error("Impossible de charger les catégories", err);
            }
        };
        fetchCategories();
    }, []);

    // 3. Gérer la recherche
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog?search=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-apple-border py-3' 
            : 'bg-transparent py-5'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
                
                {/* LOGO */}
                <Link to="/" className="text-2xl font-bold tracking-tighter text-apple-dark flex items-center min-w-fit">
                    TechStore<span className="text-apple-blue">.</span>
                </Link>

                {/* MENU CENTRAL - DESKTOP */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-sm font-semibold text-apple-dark/70 hover:text-apple-blue transition-colors">Accueil</Link>
                    
                    {/* DROPDOWN PRODUITS DYNAMIQUE */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsProductsOpen(true)}
                        onMouseLeave={() => setIsProductsOpen(false)}
                    >
                        <button className="flex items-center space-x-1 text-sm font-semibold text-apple-dark/70 hover:text-apple-blue transition-colors">
                            <span>Produits</span>
                            <ChevronDown size={14} className={`transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProductsOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-apple-border/50 p-2 overflow-hidden"
                                >
                                    {categories.map((cat) => (
                                        <Link 
                                            key={cat.id} 
                                            to={`/category/${cat.slug}`} 
                                            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-apple-gray text-sm font-medium text-apple-dark/80 transition-all"
                                            onClick={() => setIsProductsOpen(false)}
                                        >
                                            <Package size={16} className="text-apple-blue" />
                                            <span>{cat.name}</span>
                                        </Link>
                                    ))}
                                    <div className="border-t border-apple-gray mt-1 pt-1">
                                        <Link to="/catalog" className="block p-3 text-xs font-bold text-center text-apple-blue hover:underline">
                                            Tout le store
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* BARRE DE RECHERCHE - STYLE APPLE */}
                <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm relative group">
                    <input 
                        type="text" 
                        placeholder="Rechercher un produit..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-apple-dark/5 border-none rounded-full py-2 px-10 text-sm focus:ring-2 focus:ring-apple-blue/20 outline-none transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-dark/30 group-focus-within:text-apple-blue" size={16} />
                </form>

                {/* ACTIONS (Cart, User) */}
                <div className="flex items-center space-x-4">
                    <Link to="/cart" className="text-apple-dark hover:text-apple-blue transition relative p-1">
                        <ShoppingBag size={22} strokeWidth={2} />
                        <span className="absolute -top-1 -right-1 bg-apple-blue text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
                            0
                        </span>
                    </Link>

                    <Link 
                        to={isAuthenticated ? "/profile" : "/login"} 
                        className="flex items-center space-x-2 bg-apple-dark text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-apple-blue transition-all active:scale-95 shadow-md shadow-apple-dark/10"
                    >
                        <User size={14} />
                        <span className="hidden sm:block">{isAuthenticated ? (user?.firstName || "Compte") : "Se connecter"}</span>
                    </Link>
                    
                    <button 
                        className="md:hidden text-apple-dark p-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 top-[60px] bg-white z-40 p-8 flex flex-col space-y-6"
                    >
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold">Accueil</Link>
                        <p className="text-xs font-black uppercase text-apple-dark/30 tracking-widest pt-4">Catégories</p>
                        {categories.map((cat) => (
                            <Link 
                                key={cat.id} 
                                to={`/category/${cat.slug}`} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-semibold border-b border-apple-gray pb-2 flex justify-between items-center"
                            >
                                {cat.name} <ChevronDown size={18} className="-rotate-90 text-apple-dark/20" />
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;