import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, checkIsAdmin, logOut } from '../../lib/firebase/auth';
import { Mail, Lock, Loader2, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl } from '../../utils';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Sign in
      const result = await signInWithEmail(formData.email, formData.password);
      
      if (!result.success || !result.user) {
        throw new Error(result.error || 'Failed to sign in');
      }

      // 2. Check Admin Status
      const isAdmin = await checkIsAdmin(result.user.email);
      
      if (isAdmin) {
        navigate('/dashboard/admin');
      } else {
        // Not an admin - log them out immediately
        await logOut();
        throw new Error('Access Denied: You do not have administrative privileges.');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans relative overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
            <img 
                src={getOptimizedImageUrl('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', 1600)}
                alt="Background"
                className="w-full h-full object-cover"
            />
        </div>

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
            <div className="p-8 sm:p-12">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <ShieldCheck className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Admin Portal</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Secure access for Lofton Realty administrators
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 text-sm mb-6"
                    >
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium text-gray-900"
                                placeholder="admin@loftonrealty.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Authenticate <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Return to Website
                    </button>
                </div>
            </div>
            
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <span>&copy; 2024 Lofton Realty</span>
                <span>Restricted Access</span>
            </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLoginPage;
