import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logOut } from '../../lib/firebase/auth';
import { Loader2, ShieldAlert, LogOut } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  const handleLogout = async () => {
    await logOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand animate-spin mb-4" />
        <p className="text-muted-foreground/60 text-sm font-medium tracking-widest uppercase animate-pulse">
          Verifying Access...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-accent px-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="text-red-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          You do not have administrative privileges to view this page.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-background border border-border text-foreground px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};