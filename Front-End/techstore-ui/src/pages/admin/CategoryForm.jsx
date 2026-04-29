import React, { useState } from 'react';
import { X, Save, Layers } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CategoryForm = ({ category, categories, onClose, onSave, theme }) => {
    const isDark = theme === 'dark';
    const [formData, setFormData] = useState(category || {
        name: '', slug: '', iconUrl: '', parentId: null
    });

    const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") setFormData({ ...formData, name: value, slug: slugify(value) });
        else setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} 
                className={`w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden ${isDark ? 'bg-[#111421] text-white border border-white/10' : 'bg-white text-slate-800 border border-gray-100'}`}>
                
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h2 className="text-2xl font-black italic">Organiser le Store.</h2>
                    <button type="button" onClick={onClose} className="opacity-40 hover:opacity-100 transition-all"><X size={24}/></button>
                </div>

                <div className="p-10 space-y-6">
                    <Input label="NOM DE LA CATÉGORIE" name="name" value={formData.name} onChange={handleChange} required theme={theme} />
                    <Input label="URL DE L'ICÔNE (PNG/SVG)" name="iconUrl" value={formData.iconUrl} onChange={handleChange} placeholder="https://cdn..." theme={theme} />

                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 block italic">RATTACHEMENT (PARENT)</label>
                        <select 
                            name="parentId"
                            value={formData.parentId || ""}
                            onChange={(e) => setFormData({...formData, parentId: e.target.value || null})}
                            className={`w-full p-4 rounded-2xl font-bold outline-none border transition-all ${isDark ? 'bg-black/20 border-white/5 text-white' : 'bg-gray-100 text-slate-900'}`}
                        >
                            <option value="">-- Catégorie Racine (Principale) --</option>
                            {categories.filter(c => c.id !== category?.id).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/5">
                    <Button type="submit" className="w-full py-4 shadow-xl shadow-indigo-500/20">
                        <Save size={20} className="mr-2"/> Confirmer le rayon
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CategoryForm;