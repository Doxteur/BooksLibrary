import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/core/Sidebar';
import { Header } from '@/components/core/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <Sidebar />
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
          <Header />
          <main className='flex-1 p-4 sm:px-6 sm:py-0'>
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Layout;
