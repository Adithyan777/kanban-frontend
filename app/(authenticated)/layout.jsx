'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu, List, KanbanSquare, User, Settings } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const AppLayout = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/todos', label: 'Task List', icon: List },
    { href: '/board', label: 'Kanban Board', icon: KanbanSquare },
  ];

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-60 shadow-md border-none dark:bg-background">
        <div className="flex items-center justify-center gap-2 h-16 border-b">
          <Layout className="h-8 w-8 my-4 ml-6 text-blue-500" />
          <h2 className="scroll-m-20 my-4 mr-7 text-2xl font-bold tracking-tight first:mt-0">
            Kanban-Todo
          </h2>
        </div>
        <nav className="mt-11">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-blue-200 dark:hover:text-gray-700 ${
                  pathname === item.href ? 'bg-blue-100 text-blue-900 dark:bg-blue-400'  : ''
                }`}>
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.label}
                </span>
              </Link>
            );
          })}
          <div className="px-2 py-2">
            <ModeToggle />
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-background">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;