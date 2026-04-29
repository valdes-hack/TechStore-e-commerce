import React, { useState, useCallback, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { ListFilter, X, Menu } from 'lucide-react';

const AdminLayout = ({ children, filters, theme, toggleTheme }) => {
    // États de largeur initiaux avec limites de sécurité
    const [sideWidth, setSideWidth] = useState(260);
    const [filterWidth, setFilterWidth] = useState(300);
    
    // États pour les menus mobiles
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- LOGIQUE DE REDIMENSIONNEMENT GAUCHE (SIDEBAR) ---
    const startResizeLeft = useCallback((e) => {
        e.preventDefault();
        const onMove = (moveEvent) => {
            const newWidth = moveEvent.clientX;
            // Bloque entre 80px (icônes) et 400px
            if (newWidth >= 80 && newWidth <= 400) {
                setSideWidth(newWidth);
            }
        };
        const onUp = () => window.removeEventListener('mousemove', onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, []);

    // --- LOGIQUE DE REDIMENSIONNEMENT DROIT (FILTRES) ---
    const startResizeRight = useCallback((e) => {
        e.preventDefault();
        const onMove = (moveEvent) => {
            const newWidth = window.innerWidth - moveEvent.clientX;
            // Bloque entre 250px et 500px
            if (newWidth >= 250 && newWidth <= 500) {
                setFilterWidth(newWidth);
            }
        };
        const onUp = () => window.removeEventListener('mousemove', onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, []);

    return (
        <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#0b0e14] text-gray-300' : 'bg-[#f4f7fe] text-slate-700'
        }`}>
            
            {/* ✨ LE RIDEAU NOIR FLOU (OVERLAY) ✨ */}
            {/* Apparaît sur mobile quand l'un des deux menus est ouvert */}
            {(isMobileNavOpen || isFilterOpen) && (
                <div 
                    onClick={() => {
                        setIsMobileNavOpen(false);
                        setIsFilterOpen(false);
                    }} 
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[140] lg:hidden animate-in fade-in duration-300" 
                />
            )}
            
            {/* 1. SIDEBAR GAUCHE (Navigation) - Z-INDEX 150 */}
            <AdminSidebar 
                width={sideWidth} 
                setWidth={setSideWidth}
                theme={theme} 
                toggleTheme={toggleTheme}
                onResize={startResizeLeft}
                isMobileOpen={isMobileNavOpen}
                setIsMobileOpen={setIsMobileNavOpen}
            />

            {/* 2. ZONE CENTRALE (Scrollable & Dynamique) */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                
                {/* Header Mobile - S'affiche uniquement sur Mobile */}
                <header className="lg:hidden p-4 flex justify-between items-center bg-transparent border-b border-white/5">
                    <button 
                        onClick={() => setIsMobileNavOpen(true)} 
                        className="p-2.5 bg-indigo-600/10 text-indigo-500 rounded-xl"
                    >
                        <Menu size={22}/>
                    </button>
                    <span className="font-black italic tracking-tighter text-indigo-500">AdminHub</span>
                    <button 
                        onClick={() => setIsFilterOpen(true)} 
                        className="p-2.5 bg-indigo-600/10 text-indigo-500 rounded-xl"
                    >
                        <ListFilter size={22}/>
                    </button>
                </header>

                {/* Contenu de la page (Tableaux, Stats, etc.) */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar scroll-smooth">
                    {children}
                </main>
            </div>

            {/* 3. SIDEBAR DROITE (Filtres) - Z-INDEX 150 */}
            <aside 
                style={{ width: `${filterWidth}px` }}
                className={`
                    fixed lg:relative top-0 right-0 z-[150] h-full flex flex-col transition-all duration-300 border-l
                    ${isFilterOpen ? 'translate-x-0 w-full sm:w-[350px]' : 'translate-x-full lg:translate-x-0'}
                    ${theme === 'dark' ? 'bg-[#111421] border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-xl'}
                `}
            >
                {/* Handle de redimensionnement Desktop */}
                <div 
                    onMouseDown={startResizeRight} 
                    className="absolute left-0 top-0 w-1 h-full cursor-col-resize hover:bg-indigo-500 transition-colors hidden lg:block z-50" 
                />
                
                <div className="p-8 flex flex-col h-full">
                    {/* Header mobile du filtre */}
                    <div className="flex justify-end items-center lg:hidden mb-4">
                        <button 
                            onClick={() => setIsFilterOpen(false)} 
                            className="p-2 bg-red-500/10 text-red-500 rounded-full"
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    {/* Zone de filtres injectée par la page */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {filters}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default AdminLayout;