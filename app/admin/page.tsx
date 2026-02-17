'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate, DashboardStats } from '@/types/certificate';
import { StatCard } from '@/components/dashboard/stat-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { FileText, CheckCircle, XCircle, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIssued: 0,
    activeOnChain: 0,
    revokedCount: 0,
    recentVerifications: 0,
  });
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const certsRef = collection(db, 'certificates');
      const certsSnapshot = await getDocs(certsRef);
      
      const totalIssued = certsSnapshot.size;
      const revokedCount = certsSnapshot.docs.filter(
        doc => doc.data().isRevoked
      ).length;
      const activeOnChain = totalIssued - revokedCount;

      setStats({
        totalIssued,
        activeOnChain,
        revokedCount,
        recentVerifications: 0,
      });

      const recentQuery = query(
        certsRef,
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentSnapshot = await getDocs(recentQuery);
      
      const certs = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Certificate[];
      
      setRecentCertificates(certs);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-900/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl" />
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Certificate Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl"
          >
            Manage and track your blockchain-verified certificates
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Issued"
          value={stats.totalIssued}
          icon={FileText}
          gradient="from-blue-500 to-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Active Certificates"
          value={stats.activeOnChain}
          icon={CheckCircle}
          gradient="from-green-500 to-emerald-600"
          delay={0.2}
        />
        <StatCard
          title="Revoked"
          value={stats.revokedCount}
          icon={XCircle}
          gradient="from-red-500 to-rose-600"
          delay={0.3}
        />
        <StatCard
          title="Growth"
          value={stats.totalIssued}
          icon={TrendingUp}
          gradient="from-purple-500 to-pink-600"
          delay={0.4}
        />
      </div>

      {/* Recent Activity */}
      {recentCertificates.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Certificates</h2>
            <Link href="/admin/issued">
              <Button variant="ghost" className="gap-2 group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                
                <div className="relative flex items-center gap-4 p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-2xl hover:border-gray-700/50 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white mb-1 truncate">{cert.recipientName}</p>
                    <p className="text-sm text-gray-400 truncate">{cert.courseName}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {cert.issueDate}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        cert.isRevoked
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
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
    </div>
  );
}
