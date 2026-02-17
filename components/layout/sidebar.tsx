'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/create', label: 'Create', icon: PlusCircle },
  { href: '/admin/issued', label: 'Certificates', icon: FileText },
  { href: '/verify', label: 'Verify', icon: Shield },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Floating Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded-full shadow-lg backdrop-blur-sm"
      >
        <Link href="/" className="px-4 py-2 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="w-5 h-5 text-white" />
          <span className="font-bold text-white">CertiChain</span>
        </Link>
        
        <div className="w-px h-6 bg-gray-700 mx-2" />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 rounded-full transition-colors"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </AnimatePresence>
              <span className={cn(
                'relative z-10 text-sm font-medium transition-colors flex items-center gap-2',
                isActive ? 'text-black' : 'text-gray-300 hover:text-white'
              )}>
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.nav>

      {/* Mobile Bottom Nav */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700"
      >
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] flex-1"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="relative"
                >
                  <Icon className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-white' : 'text-gray-500'
                  )} />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </motion.div>
                <span className={cn(
                  'text-[10px] font-medium transition-colors',
                  isActive ? 'text-white' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
