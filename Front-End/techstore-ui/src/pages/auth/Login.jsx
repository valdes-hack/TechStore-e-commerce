import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/auth.service';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ChevronRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login: saveAuth } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
        const res = await AuthService.login(formData);
        if (res && res.data) {
            const { user, token } = res.data;
            saveAuth(user, token);
            
            // On utilise setTimeout pour laisser React "respirer" un millième de seconde
            setTimeout(() => {
                if (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/profile');
                }
            }, 50);
        }
    } catch (err) {
            console.error("Erreur détectée :", err);
            // On transforme l'erreur en texte pur pour ne pas faire crasher React
            const msg = err.message || (err.data && err.data.message) || "Identifiants invalides.";
            setError(String(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-apple-border/50">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold tracking-tighter text-apple-dark">Connectez-vous.</h2>
                    <p className="text-apple-dark/50 mt-2 font-medium">TechStore par Valdes.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 italic">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="Adresse e-mail" name="email" type="email" onChange={handleChange} required />
                    <Input label="Mot de passe" name="password" type="password" onChange={handleChange} required />
                    <div className="pt-4">
                        <Button type="submit" className="w-full py-4" loading={loading}>
                            Se connecter <ChevronRight className="ml-2" size={18} />
                        </Button>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-apple-border text-center">
                    <button onClick={() => navigate('/register')} className="text-apple-blue font-bold hover:underline">
                        Créer un profil gratuit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;