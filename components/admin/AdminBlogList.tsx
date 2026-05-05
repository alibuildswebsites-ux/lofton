import React, { useEffect, useState } from 'react';
import { getBlogs, deleteBlog } from '../../lib/firebase/firestore';
import { BlogPost } from '../../types';
import { Plus, Pencil, Trash2, Search, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminBlogListProps {
  onEdit: (blog: BlogPost) => void;
  onAddNew: () => void;
}

export const AdminBlogList: React.FC<AdminBlogListProps> = ({ onEdit, onAddNew }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    // Fetch all blogs (both draft and published)
    const data = await getBlogs(false); 
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      const result = await deleteBlog(id);
      if (result.success) {
        setBlogs(prev => prev.filter(b => b.id !== id));
      } else {
        alert("Failed to delete blog post");
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your articles.</p>
        </div>
        <button 
          onClick={onAddNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
        >
          <Plus size={20} /> Create New Blog
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={20} />
        <input 
          type="text" 
          placeholder="Search by title or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-brand" size={40} />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-background rounded-2xl border border-border">
           <p className="text-muted-foreground font-medium">No blog posts found.</p>
        </div>
      ) : (
        <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-accent border-b border-border">
                 <tr>
                   <th className="px-6 py-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Title</th>
                   <th className="px-6 py-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Category</th>
                   <th className="px-6 py-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Status</th>
                   <th className="px-6 py-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Date</th>
                   <th className="px-6 py-4 font-bold text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {filteredBlogs.map(blog => (
                   <tr key={blog.id} className="hover:bg-accent transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                           {blog.featuredImage ? (
                             <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-muted-foreground/60 text-xs">No Img</div>
                           )}
                         </div>
                          <div>
                            <h4 className="font-bold text-foreground line-clamp-1">{blog.title}</h4>
                            {blog.published ? (
                              <Link to={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline">View Live</Link>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">Draft</span>
                            )}
                          </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                          {blog.category}
                        </span>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          blog.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-muted-foreground">
                       {new Date(blog.createdAt).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onEdit(blog)}
                            aria-label="Edit blog post"
                            className="p-2 text-muted-foreground/60 hover:text-brand hover:bg-brand-light rounded-lg transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(blog.id)}
                            aria-label="Delete blog post"
                            className="p-2 text-muted-foreground/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
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
  );
};