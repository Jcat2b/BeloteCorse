import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { Home, User, LogOut } from 'lucide-react';
import { auth } from '../../config/firebase';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">Belote Corse</h1>
            
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  location.pathname === '/' ? 'bg-primary-700' : 'hover:bg-primary-500'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Accueil</span>
              </Link>
              
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  location.pathname === '/profile' ? 'bg-primary-700' : 'hover:bg-primary-500'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profil</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-500"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;