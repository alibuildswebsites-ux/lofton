import React, { useEffect, useState } from 'react';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, updateTestimonialOrder } from '../../lib/firebase/firestore';
import { Testimonial } from '../../types';
import { Plus, Pencil, Trash2, GripVertical, Save, Loader2, X } from 'lucide-react';
import { Reorder } from 'framer-motion';

export const AdminTestimonialList = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ quote: '', author: '', role: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (t: Testimonial) => {
    setFormData({ quote: t.quote, author: t.author, role: t.role });
    setEditingId(t.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({ quote: '', author: '', role: '' });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (editingId) {
      await updateTestimonial(editingId, formData);
    } else {
      await addTestimonial(formData);
    }
    await fetchTestimonials();
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this testimonial?")) {
      await deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleReorder = (newOrder: Testimonial[]) => {
    setTestimonials(newOrder);
    setHasOrderChanged(true);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    await updateTestimonialOrder(testimonials);
    setHasOrderChanged(false);
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground">Manage client reviews and display order.</p>
        </div>
        <div className="flex gap-2">
          {hasOrderChanged && (
            <button 
              onClick={saveOrder}
              disabled={isSaving}
              className="bg-foreground text-background px-4 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Save Order
            </button>
          )}
          <button 
            onClick={handleAddNew}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand/20 hover:bg-brand-dark"
          >
            <Plus size={20}/> Add New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand" size={40}/></div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="w-12 px-4 py-4"></th>
                <th className="px-6 py-4 font-bold text-muted-foreground text-sm">Quote</th>
                <th className="px-6 py-4 font-bold text-muted-foreground text-sm">Author</th>
                <th className="px-6 py-4 font-bold text-muted-foreground text-sm text-right">Actions</th>
              </tr>
            </thead>
            <Reorder.Group as="tbody" axis="y" values={testimonials} onReorder={handleReorder} className="divide-y divide-gray-100">
              {testimonials.map(t => (
                <Reorder.Item key={t.id} value={t} as="tr" className="hover:bg-accent bg-background">
                  <td className="px-4 py-4 text-muted-foreground/60 cursor-grab active:cursor-grabbing"><GripVertical size={20}/></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground italic line-clamp-2 max-w-md">"{t.quote}"</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(t)} className="p-2 text-muted-foreground/60 hover:text-brand"><Pencil size={18}/></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-muted-foreground/60 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button onClick={() => setIsEditing(false)}><X size={24} className="text-muted-foreground/60"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Quote</label>
                <textarea 
                  required
                  rows={4}
                  maxLength={300}
                  value={formData.quote}
                  onChange={e => setFormData({...formData, quote: e.target.value})}
                  className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  placeholder="Enter client testimonial..."
                />
                <div className="text-right text-xs text-muted-foreground/60">{formData.quote.length}/300</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Author Name</label>
                  <input 
                    required
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Role</label>
                  <input 
                    required
                    placeholder="e.g. Buyer"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-brand-dark transition-colors"
              >
                {isSaving ? <Loader2 className="animate-spin"/> : 'Save Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};