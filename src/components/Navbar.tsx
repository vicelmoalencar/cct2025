import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Bell, 
  Search,
  User,
  Menu as MenuIcon,
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import logoImage from '../assets/logocct.png';

export function Navbar() {
  const { user, signOut } = useAuthContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = user?.user_metadata?.role === 'admin';

  const navigationItems = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Cursos', href: '/courses', icon: BookOpen },
    { name: 'Comunidade', href: '/community', icon: Users },
    { name: 'Suporte', href: '/support', icon: MessageSquare },
  ];

  const adminItems = [
    { name: 'Gerenciar Usuários', href: '/users', icon: Users },
    { name: 'Dashboard', href: '/admin', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      // O redirecionamento acontecerá automaticamente pelo ProtectedRoute
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logoImage} alt="Logo CCT" className="h-8 w-auto" />
              <span className="font-bold text-xl text-gray-900">CCT</span>
            </Link>
          </div>

          {/* Navegação Principal - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Menu Admin */}
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <Settings className="w-5 h-5" />
                  <span>Admin</span>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="py-1">
                    {adminItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ações do Usuário - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <Search className="w-5 h-5" />
            </button>

            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={user.user_metadata.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-8 h-8 p-1 rounded-full bg-gray-200 text-gray-600" />
                )}
              </button>

              {/* Menu do Usuário - Desktop */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <div className="font-medium">{user?.user_metadata?.name || 'Usuário'}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de Busca Expandida - Desktop */}
        {isSearchOpen && (
          <div className="hidden md:block py-3">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Menu Admin - Mobile */}
            {isAdmin && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </div>
                {adminItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}