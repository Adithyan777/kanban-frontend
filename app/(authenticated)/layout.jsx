'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu, List, KanbanSquare, User, LogOut, X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const AppLayout = ({ children }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { href: '/todos', label: 'Task List', icon: List },
    { href: '/board', label: 'Kanban Board', icon: KanbanSquare },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavContent = () => (
    <>
      <div className="flex-grow">
        <div className='mt-11'>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <span className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-blue-200 dark:hover:text-gray-700 ${
                pathname === item.href ? 'bg-blue-100 text-blue-900 dark:bg-blue-400' : ''
              }`}>
                <IconComponent className="h-5 w-5 mr-3" />
                {item.label}
              </span>
            </Link>
          );
        })}
        </div>
      </div>
      <div className="mt-auto mb-5">
        <div className="px-6 py-3">
          <ModeToggle />
        </div>
        <div className="px-6 py-3">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-blue-200 dark:hover:text-gray-700"
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/');
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 m-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        w-full md:w-60 shadow-md border-none dark:bg-background
        fixed top-0 left-0 h-full z-40 bg-white
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        <div className="flex items-center justify-center gap-2 h-16 border-b">
          <Layout className="h-8 w-8 my-4 ml-6 text-blue-500" />
          <h2 className="scroll-m-20 my-4 mr-7 text-2xl font-bold tracking-tight first:mt-0">
            Kanban-Todo
          </h2>
        </div>
        <nav className="flex flex-col flex-grow overflow-y-auto">
          <NavContent />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-60 overflow-auto bg-background">
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;