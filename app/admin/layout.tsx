import { Navigation } from '@/components/layout/sidebar';
import { FirebaseStatus } from '@/components/debug/firebase-status';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20 lg:pt-8 pb-24 lg:pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      <FirebaseStatus />
    </div>
  );
}
