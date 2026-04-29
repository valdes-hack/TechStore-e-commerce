import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-apple-gray pt-20 pb-10 px-6 border-t border-apple-border">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div>
                    <h4 className="text-sm font-bold text-apple-dark mb-6">Shopping</h4>
                    <ul className="space-y-3 text-sm text-apple-dark/60">
                        <li><Link to="/category/iphone">iPhone</Link></li>
                        <li><Link to="/category/macbook">MacBook</Link></li>
                        <li><Link to="/category/gaming">Gaming</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-apple-dark mb-6">Services</h4>
                    <ul className="space-y-3 text-sm text-apple-dark/60">
                        <li><Link to="/cart">Mon Panier</Link></li>
                        <li><Link to="/support">SAV & Garantie</Link></li>
                        <li><Link to="/shipping">Livraison</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-apple-dark mb-6">Compte</h4>
                    <ul className="space-y-3 text-sm text-apple-dark/60">
                        <li><Link to="/login">Connexion</Link></li>
                        <li><Link to="/profile">Mon Profil</Link></li>
                        <li><Link to="/wishlist">Favoris</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-apple-dark mb-6">TechStore</h4>
                    <p className="text-sm text-apple-dark/50 leading-relaxed">
                        Le futur de l'électronique au Cameroun. <br />
                        Douala - Yaoundé - Kribi
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-apple-dark/5 pt-8 text-[11px] text-apple-dark/40">
                <p>© 2025 TechStore Valdes. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;