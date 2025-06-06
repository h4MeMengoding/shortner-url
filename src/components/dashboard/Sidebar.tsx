'use client';

import React, { useState, useEffect } from 'react';
import { Link, BarChart3, Plus, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'My URLs',
      href: '/dashboard/urls',
      icon: Link,
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-navy-800 border-r border-gray-700 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-navy-700 hover:text-gray-100'
                  )}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Create URL Button */}
          <div className="p-4 border-t border-gray-700">
            <a
              href="/dashboard/create"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Short URL
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
