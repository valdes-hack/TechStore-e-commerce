import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Plus, Trash2, Globe, FileUp } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ProductService from '../../services/product.service';

const ProductForm = ({ product, onClose, onSave, onDelete, theme }) => {
    
    // 1. Initialisation intelligente (Transfère les données SQL vers le Formulaire)
    const [formData, setFormData] = useState(() => {
        if (product) {
            return {
                id: product.id,
                name: product.name || '',
                slug: product.slug || '',
                sku: product.sku || '',
                brand: product.brand || '',
                basePrice: product.basePrice || product.base_price || '',
                stockQty: product.stockQty || product.stock_qty || '',
                description: product.description || '',
                categoryId: product.categoryId || product.category?.id || '',
                imageUrls: product.images ? product.images.map(img => img.url) : []
            };
        }
        return {
            name: '', slug: '', sku: '', brand: '', basePrice: '', stockQty: '', description: '',
            categoryId: '', imageUrls: []
        };
    });

    const [categories, setCategories] = useState([]);
    const [imageType, setImageType] = useState('link'); 
    const [tempUrl, setTempUrl] = useState('');

    const isDark = theme === 'dark';

    // Fonction Slugify
    const slugify = (text) => {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')     
            .replace(/[^\w-]+/g, '')  
            .replace(/--+/g, '-');    
    };

    useEffect(() => {
        const loadCats = async () => {
            const res = await ProductService.getCategories();
            if (res && res.data) setCategories(res.data);
        };
        loadCats();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            setFormData({ ...formData, name: value, slug: slugify(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addImageUrl = () => {
        if (tempUrl.trim()) {
            setFormData({ ...formData, imageUrls: [...formData.imageUrls, tempUrl] });
            setTempUrl('');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrls: [...formData.imageUrls, reader.result] });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index) => {
        const newList = formData.imageUrls.filter((_, i) => i !== index);
        setFormData({ ...formData, imageUrls: newList });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            basePrice: parseFloat(formData.basePrice),
            stockQty: parseInt(formData.stockQty),
            categoryId: parseInt(formData.categoryId)
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
            <form 
                onSubmit={handleSubmit} 
                className={`w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border ${
                    isDark ? 'bg-[#111421] border-white/10 text-white' : 'bg-white border-gray-200 text-slate-800'
                }`}
            >
                
                {/* Header */}
                <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                            <Plus size={24} />
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter">
                            {product ? 'Éditer' : 'Nouveau'} Produit.
                        </h2>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        {product && (
                            <button 
                                type="button" 
                                onClick={() => onDelete(product.id)}
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                            >
                                <Trash2 size={24} />
                            </button>
                        )}
                        <button type="button" onClick={onClose} className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-800'}`}>
                            <X size={24}/>
                        </button>
                    </div>
                </div>

                <div className="p-8 lg:p-12 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-12 custom-scrollbar">
                    
                    {/* SECTION INFOS (GAUCHE) */}
                    <div className="space-y-8">
                        <div>
                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 block ${isDark ? 'opacity-40' : 'text-slate-400'}`}>Identité du produit</label>
                            <div className="space-y-5">
                                <Input label="Désignation" name="name" value={formData.name} onChange={handleChange} required placeholder="iPhone 15 Pro Max" theme={theme} />
                                
                                <div className={`px-4 py-3 rounded-2xl border flex justify-between items-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-100 border-transparent'}`}>
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">URL Slug</span>
                                    <code className="text-xs font-mono opacity-60">/{formData.slug || '...'}</code>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Marque" name="brand" value={formData.brand} onChange={handleChange} required placeholder="Apple" theme={theme} />
                                    <Input label="Référence SKU" name="sku" value={formData.sku} onChange={handleChange} required placeholder="REF-001" theme={theme} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Prix de vente (F)" name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} required theme={theme} />
                            <Input label="Unités en stock" name="stockQty" type="number" value={formData.stockQty} onChange={handleChange} required theme={theme} />
                        </div>

                        <div>
                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ${isDark ? 'opacity-40' : 'text-slate-400'}`}>Catégorisation</label>
                            <select 
                                name="categoryId" value={formData.categoryId} onChange={handleChange} required
                                className={`w-full p-4 rounded-2xl outline-none font-bold text-sm border transition-all ${
                                    isDark ? 'bg-black/20 border-white/5 focus:border-indigo-500 text-white' : 'bg-gray-100 border-transparent text-slate-900'
                                }`}
                            >
                                <option value="">Choisir un rayon...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <textarea 
                            name="description" value={formData.description} onChange={handleChange}
                            placeholder="Racontez l'histoire du produit..." 
                            className={`w-full p-5 rounded-[1.5rem] h-32 outline-none border transition-all text-sm font-medium ${
                                isDark ? 'bg-black/20 border-white/5 focus:border-indigo-500 text-white' : 'bg-gray-100 border-transparent text-slate-900'
                            }`}
                        />
                    </div>

                    {/* SECTION VISUELS (DROITE) */}
                    <div className="space-y-8">
                        <div>
                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 block ${isDark ? 'opacity-40' : 'text-slate-400'}`}>Galerie Multimédia</label>
                            <div className={`grid grid-cols-3 gap-4 min-h-[180px] p-5 rounded-[2.5rem] border-2 border-dashed overflow-y-auto max-h-[350px] custom-scrollbar ${
                                isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'
                            }`}>
                                {formData.imageUrls?.map((url, index) => (
                                    <div key={index} className="relative group aspect-square bg-white rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                        <img src={url} className="w-full h-full object-contain p-2" alt="product-img" />
                                        <button 
                                            type="button" onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {formData.imageUrls.length === 0 && (
                                    <div className="col-span-3 flex flex-col items-center justify-center opacity-20 py-10">
                                        <ImageIcon size={48} />
                                        <p className="text-[10px] font-black mt-2">AUCUNE PHOTO</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`p-1.5 flex rounded-2xl ${isDark ? 'bg-black/40' : 'bg-gray-100'}`}>
                            <button type="button" onClick={() => setImageType('link')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center ${imageType === 'link' ? (isDark ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-indigo-600') : 'opacity-40'}`}>
                                <Globe size={14} className="mr-2"/> LIEN WEB
                            </button>
                            <button type="button" onClick={() => setImageType('file')} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center ${imageType === 'file' ? (isDark ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-indigo-600') : 'opacity-40'}`}>
                                <FileUp size={14} className="mr-2"/> UPLOAD
                            </button>
                        </div>

                        {imageType === 'link' ? (
                            <div className="flex space-x-2">
                                <div className="flex-1"><Input placeholder="Coller le lien https://..." value={tempUrl} onChange={e => setTempUrl(e.target.value)} theme={theme} /></div>
                                <button type="button" onClick={addImageUrl} className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 transition-all active:scale-95"><Plus size={20}/></button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input type="file" onChange={handleFileChange} className="hidden" id="admin-f-up" accept="image/*" />
                                <label htmlFor="admin-f-up" className={`w-full p-5 border-2 border-dashed rounded-[1.5rem] flex justify-center items-center font-bold cursor-pointer transition-all ${
                                    isDark ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10' : 'bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                                }`}>
                                    <Upload size={20} className="mr-3" /> Téléverser un fichier
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Fixe */}
                <div className={`p-8 border-t flex justify-end items-center space-x-6 ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                    <button type="button" onClick={onClose} className="text-sm font-bold opacity-40 hover:opacity-100 transition-all uppercase tracking-widest">Fermer</button>
                    <Button type="submit" className="px-16 shadow-2xl shadow-indigo-500/20 py-4">
                        <Save size={20} className="mr-3" /> {product ? 'Mettre à jour' : 'Publier sur le store'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;