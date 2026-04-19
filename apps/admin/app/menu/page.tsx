"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Activity, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { API_BASE } from "../../lib/api-config";

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "" 
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        axios.get(`${API_BASE}/products`),
        axios.get(`${API_BASE}/categories`)
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", categoryId: "", imageUrl: "" });
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || ""
    });
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price.toString());
      data.append("categoryId", formData.categoryId);
      
      if (selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
              data.append("images", file);
          });
      } else if (formData.imageUrl) {
          data.append("imageUrl", formData.imageUrl);
      }

      const config = {
          headers: { 
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${token}`
          }
      };

      if (editingProduct) {
          await axios.patch(`${API_BASE}/products/${editingProduct.id}`, data, config);
      } else {
          await axios.post(`${API_BASE}/products`, data, config);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
      alert(editingProduct ? "Error updating product" : "Error creating product");
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await axios.patch(`${API_BASE}/products/${id}/availability`, { available: !current });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const softDelete = async (id: string) => {
    if (!confirm("Are you sure? This will hide the product from the menu.")) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Menu Management</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Add, edit or disable products from your digital menu.</p>
        </div>
        <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-hover transition-all shadow-[0_0_30px_rgba(255,106,0,0.3)] active:scale-95"
        >
          <Plus className="w-5 h-5" /> ADD NEW PRODUCT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`stat-card group flex flex-col p-4 ${!product.available ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-black border border-white/5">
                    <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : (product.imagePath ? `https://api-production-48c5.up.railway.app${product.imagePath}` : product.imageUrl)} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={product.name} 
                    />
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white border border-white/20">
                            +{product.images.length - 1} images
                        </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black uppercase text-primary border border-primary/20">
                            {product.category?.name || "Uncategorized"}
                        </div>
                        {!product.available && (
                            <div className="px-3 py-1 bg-red-600 rounded-lg text-[10px] font-black uppercase text-white shadow-xl">
                                DISABLED
                            </div>
                        )}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-black uppercase italic tracking-tighter">{product.name}</h3>
                        <button 
                            onClick={() => toggleAvailability(product.id, product.available)}
                            className={`p-1.5 rounded-lg border transition-all ${product.available ? 'bg-green-600/10 border-green-500/20 text-green-500' : 'bg-red-600/10 border-red-500/20 text-red-500'}`}
                        >
                            <Activity className="w-3 h-3" />
                        </button>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 line-clamp-2 mt-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                      <span className="text-xl font-black italic">{parseFloat(product.price).toFixed(2)}€</span>
                      <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-2.5 bg-white/5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all border border-white/5"
                          >
                              <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => softDelete(product.id)}
                            className="p-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all border border-white/10"
                          >
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
              </motion.div>
          ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-[#121215] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h2 className="text-2xl font-black italic uppercase italic tracking-tighter text-white">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Product Name</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Category</label>
                            <select 
                                required
                                value={formData.categoryId}
                                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm"
                            >
                                <option value="" className="bg-black">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Price (€)</label>
                            <input 
                                type="number" step="0.01" required
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 font-bold text-sm"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Product Images (Multiple allowed)</label>
                            <div className="flex flex-col gap-4">
                                <input 
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files) {
                                            setSelectedFiles(Array.from(e.target.files));
                                        }
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-xs font-bold"
                                />
                                {selectedFiles.length > 0 && (
                                    <p className="text-[10px] text-primary">{selectedFiles.length} fichiers sélectionnés</p>
                                )}
                                <div className="flex items-center text-slate-700 uppercase text-[10px] font-black">OR URL (Retro-compatibility)</div>
                                <input 
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-primary/50 text-xs font-bold"
                                    placeholder="Paste URL..."
                                />
                            </div>
                        </div>

                        {/* Live Image Preview */}
                        {(selectedFiles.length > 0 || formData.imageUrl) && (
                            <div className="space-y-2 col-span-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Aperçu</label>
                                <div className="flex gap-3 flex-wrap">
                                    {selectedFiles.length > 0 ? selectedFiles.map((file, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-primary/30">
                                            <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-1 right-1 bg-black/60 text-[8px] text-white px-1 rounded">{i + 1}</div>
                                        </div>
                                    )) : formData.imageUrl ? (
                                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10">
                                            <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Description</label>
                        <textarea 
                            required
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 h-32 resize-none font-bold text-sm"
                        />
                    </div>

                    <button type="submit" className="w-full py-5 bg-primary rounded-2xl font-black uppercase text-sm italic tracking-widest shadow-2xl hover:bg-primary-hover transition-all">
                        {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                    </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
