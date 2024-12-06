import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import {
  Home,
  BookOpen,
  Users,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuthContext();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Cursos', href: '/courses', icon: BookOpen },
    { name: 'Wiki', href: '/wiki', icon: BookOpen },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Suporte', href: '/support', icon: HelpCircle },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-2xl font-bold text-gray-900">CCT</h1>
          </div>
          <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    location.pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <Icon
                    className={cn(
                      location.pathname === item.href
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-5 w-5 flex-shrink-0'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
          <div className="group block w-full flex-shrink-0">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}`}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {profile?.name || 'Usuário'}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="ml-auto flex items-center text-sm text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}