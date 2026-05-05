import React, { useEffect, useState } from 'react';
import { getProperties, deleteProperty } from '../../lib/firebase/firestore';
import { Property, BlogPost, Agent } from '../../types';
import { Plus, Pencil, Trash2, Search, LayoutGrid, FileText, Users, BarChart3, MessageSquare, Briefcase } from 'lucide-react';
import { AdminPropertyForm } from './AdminPropertyForm';
import { AdminBlogList } from './AdminBlogList';
import { AdminBlogForm } from './AdminBlogForm';
import { AdminAgentList } from './AdminAgentList';
import { AdminAgentForm } from './AdminAgentForm';
import { AdminOverview } from './AdminOverview';
import { AdminClientList } from './AdminClientList';
import { AdminTestimonialList } from './AdminTestimonialList';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'blogs' | 'agents' | 'clients' | 'testimonials'>('overview');
  
  // Property State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // Blog State
  const [blogViewMode, setBlogViewMode] = useState<'list' | 'form'>('list');
  const [editingBlog, setEditingBlog] = useState<BlogPost | undefined>(undefined);

  // Agent State
  const [agentViewMode, setAgentViewMode] = useState<'list' | 'form'>('list');
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);

  const fetchProperties = async () => {
    setLoadingProps(true);
    const data = await getProperties();
    setProperties(data as Property[]);
    setLoadingProps(false);
  };

  useEffect(() => {
    if (activeTab === 'properties') fetchProperties();
  }, [activeTab]);

  // Property Handlers
  const handleAddNewProp = () => { setEditingProperty(undefined); setViewMode('form'); };
  const handleEditProp = (p: Property) => { setEditingProperty(p); setViewMode('form'); };
  const handlePropSuccess = () => { setViewMode('list'); fetchProperties(); };
  const handleDeleteProp = async (id: string) => {
    if (!window.confirm('Delete this property? This cannot be undone.')) return;
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      window.alert('Failed to delete property. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'For Sale': 'bg-green-100 text-green-700',
      'Sold': 'bg-red-100 text-red-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'For Rent': 'bg-blue-100 text-blue-700',
      'Rented': 'bg-purple-100 text-purple-700',
      'Price Drop': 'bg-orange-100 text-orange-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  // Blog Handlers
  const handleAddNewBlog = () => { setEditingBlog(undefined); setBlogViewMode('form'); };
  const handleEditBlog = (b: BlogPost) => { setEditingBlog(b); setBlogViewMode('form'); };
  const handleBlogSuccess = () => { setBlogViewMode('list'); };

  // Agent Handlers
  const handleAddNewAgent = () => { setEditingAgent(undefined); setAgentViewMode('form'); };
  const handleEditAgent = (a: Agent) => { setEditingAgent(a); setAgentViewMode('form'); };
  const handleAgentSuccess = () => { setAgentViewMode('list'); };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      
      {/* Top Tab Navigation */}
      <div role="tablist" className="flex gap-4 border-b border-border overflow-x-auto no-scrollbar pb-1">
        <button role="tab" aria-selected={activeTab === 'overview'} onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <BarChart3 size={18} /> Overview
        </button>
        <button role="tab" aria-selected={activeTab === 'properties'} onClick={() => setActiveTab('properties')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'properties' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <LayoutGrid size={18} /> Properties
        </button>
        <button role="tab" aria-selected={activeTab === 'clients'} onClick={() => setActiveTab('clients')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'clients' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <Users size={18} /> Clients
        </button>
        <button role="tab" aria-selected={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'blogs' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <FileText size={18} /> Blog
        </button>
        <button role="tab" aria-selected={activeTab === 'agents'} onClick={() => setActiveTab('agents')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'agents' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <Briefcase size={18} /> Agents
        </button>
        <button role="tab" aria-selected={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'testimonials' ? 'border-brand text-brand' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <MessageSquare size={18} /> Testimonials
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && <AdminOverview />}
      
      {activeTab === 'clients' && <AdminClientList />}

      {activeTab === 'testimonials' && <AdminTestimonialList />}

      {activeTab === 'properties' && (
        viewMode === 'form' ? (
          <div className="max-w-4xl mx-auto">
            <AdminPropertyForm 
              initialData={editingProperty} 
              onSuccess={handlePropSuccess} 
              onCancel={() => setViewMode('list')} 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">Property Listings</h2>
              <button 
                onClick={handleAddNewProp}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg shadow-brand/20"
              >
                <Plus size={20} /> Add Property
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={20} />
              <input 
                type="text" 
                placeholder="Search properties..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {loadingProps ? (
              <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12 bg-background rounded-2xl border border-border text-muted-foreground">No properties found.</div>
            ) : (
              <div className="bg-background rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-accent border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-sm">Property</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-sm">Status</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-sm">Views</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-sm">Price</th>
                      <th className="px-6 py-4 font-bold text-muted-foreground text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProperties.map(p => (
                      <tr key={p.id} className="hover:bg-accent">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                              <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=100&q=80'} alt={p.title || 'Property image'} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-foreground">{p.title}</div>
                              <div className="text-xs text-muted-foreground">{p.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                          {p.views || 0}
                        </td>
                        <td className="px-6 py-4 font-bold">${p.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button aria-label="Edit property" onClick={() => handleEditProp(p)} className="p-2 text-muted-foreground/60 hover:text-brand"><Pencil size={18}/></button>
                            <button aria-label="Delete property" onClick={() => handleDeleteProp(p.id)} className="p-2 text-muted-foreground/60 hover:text-red-500"><Trash2 size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {activeTab === 'blogs' && (
        blogViewMode === 'form' ? (
          <div className="max-w-5xl mx-auto">
            <AdminBlogForm 
              initialData={editingBlog} 
              onSuccess={handleBlogSuccess} 
              onCancel={() => setBlogViewMode('list')} 
            />
          </div>
        ) : (
          <AdminBlogList onEdit={handleEditBlog} onAddNew={handleAddNewBlog} />
        )
      )}

      {activeTab === 'agents' && (
        agentViewMode === 'form' ? (
          <AdminAgentForm 
            initialData={editingAgent} 
            onSuccess={handleAgentSuccess} 
            onCancel={() => setAgentViewMode('list')} 
          />
        ) : (
          <AdminAgentList onEdit={handleEditAgent} onAddNew={handleAddNewAgent} />
        )
      )}

    </div>
  );
};