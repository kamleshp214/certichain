'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate, DashboardStats } from '@/types/certificate';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { FileText, CheckCircle, XCircle, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIssued: 0,
    activeOnChain: 0,
    revokedCount: 0,
    recentVerifications: 0,
  });
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Show message if loading takes too long
    const slowLoadTimer = setTimeout(() => {
      if (loading) {
        setSlowLoading(true);
      }
    }, 5000);
    
    return () => clearTimeout(slowLoadTimer);
  }, []);

  const loadDashboardData = async () => {
    const timeout = setTimeout(() => {
      console.warn('Dashboard data loading is taking longer than expected...');
    }, 3000);

    try {
      const certsRef = collection(db, 'certificates');
      
      // Only fetch recent certificates first (faster)
      const recentQuery = query(
        certsRef,
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      const recentSnapshot = await getDocs(recentQuery);
      clearTimeout(timeout);
      
      if (recentSnapshot.empty) {
        // No certificates exist
        setStats({
          totalIssued: 0,
          activeOnChain: 0,
          revokedCount: 0,
          recentVerifications: 0,
        });
        setRecentCertificates([]);
        setLoading(false);
        return;
      }
      
      const certs = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Certificate[];
      
      setRecentCertificates(certs.slice(0, 5));
      
      // Calculate stats from recent certs only (approximation for speed)
      const revokedInRecent = certs.filter(c => c.isRevoked).length;
      
      // For better performance, use recent data as approximation
      // In production, you'd use Firestore aggregation queries or Cloud Functions
      setStats({
        totalIssued: certs.length,
        activeOnChain: certs.length - revokedInRecent,
        revokedCount: revokedInRecent,
        recentVerifications: 0,
      });
      
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error loading dashboard:', error);
      
      // Check if it's a Firebase configuration error
      if (error instanceof Error) {
        if (error.message.includes('projectId') || error.message.includes('apiKey')) {
          console.error('Firebase configuration error. Please check your .env.local file.');
        }
      }
      
      // Set empty state on error
      setStats({
        totalIssued: 0,
        activeOnChain: 0,
        revokedCount: 0,
        recentVerifications: 0,
      });
      setRecentCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoize loading skeleton to prevent re-renders
  const loadingSkeleton = useMemo(() => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
      {slowLoading && (
        <div className="bg-gray-900 border-2 border-gray-700 rounded-xl p-6 text-center">
          <p className="text-white mb-2">Loading is taking longer than expected...</p>
          <p className="text-sm text-gray-400">
            Check the status indicator at the bottom-right corner for details.
          </p>
        </div>
      )}
    </div>
  ), [slowLoading]);

  if (loading) {
    return loadingSkeleton;
  }

  return (
    <motion.div
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h1 className="text-white">Certificate Dashboard</h1>
        <p className="text-gray-400 text-lg">
          Manage and track your blockchain-verified certificates
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <StatCard
          title="Total Issued"
          value={stats.totalIssued}
          icon={FileText}
          color="bg-white"
          delay={0}
        />
        <StatCard
          title="Active Certificates"
          value={stats.activeOnChain}
          icon={CheckCircle}
          color="bg-white"
          delay={0.1}
        />
        <StatCard
          title="Revoked"
          value={stats.revokedCount}
          icon={XCircle}
          color="bg-white"
          delay={0.2}
        />
        <StatCard
          title="Growth"
          value={stats.totalIssued}
          icon={TrendingUp}
          color="bg-white"
          delay={0.3}
        />
      </motion.div>

      {/* Recent Activity */}
      {recentCertificates.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Recent Certificates</h2>
            <Link href="/admin/issued">
              <Button variant="ghost" className="gap-2 group text-white hover:text-gray-300">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08, duration: 0.3, ease: 'easeOut' }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-600 transition-smooth">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                    <FileText className="w-6 h-6 text-black" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{cert.recipientName}</p>
                    <p className="text-sm text-gray-400 truncate">{cert.courseName}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {cert.issueDate}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-smooth ${
                        cert.isRevoked
                          ? 'bg-gray-700 text-gray-300 border border-gray-600'
                          : 'bg-white text-black border border-white'
                      }`}
                    >
                      {cert.isRevoked ? 'Revoked' : 'Active'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
