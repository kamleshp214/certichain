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
        className="hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-1 px-2 py-2 bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-full shadow-2xl"
      >
        <Link href="/admin" className="px-4 py-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-white">CertiChain</span>
        </Link>
        
        <div className="w-px h-6 bg-gray-800 mx-2" />
        
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
                    className="absolute inset-0 bg-blue-600 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </AnimatePresence>
              <span className={cn(
                'relative z-10 text-sm font-medium transition-colors flex items-center gap-2',
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
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
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-xl border-t border-gray-800/50 safe-area-inset-bottom"
      >
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-6 py-2 min-w-[64px]"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', damping: 20 }}
                >
                  <Icon className={cn(
                    'w-6 h-6 transition-colors',
                    isActive ? 'text-blue-400' : 'text-gray-500'
                  )} />
                </motion.div>
                <span className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-white' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
