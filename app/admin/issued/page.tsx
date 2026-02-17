'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types/certificate';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Ban, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function IssuedCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCerts, setFilteredCerts] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = certificates.filter(
        cert =>
          cert.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCerts(filtered);
    } else {
      setFilteredCerts(certificates);
    }
  }, [searchTerm, certificates]);

  const loadCertificates = async () => {
    const timeout = setTimeout(() => {
      console.warn('Certificate loading is taking longer than expected. This might be due to Firestore indexing or network issues.');
    }, 3000);

    try {
      const certsRef = collection(db, 'certificates');
      // Limit initial load to 50 most recent certificates for performance
      const q = query(certsRef, orderBy('createdAt', 'desc'), limit(50));
      
      const snapshot = await getDocs(q);
      clearTimeout(timeout);
      
      if (snapshot.empty) {
        console.log('No certificates found in database');
        setCertificates([]);
        setFilteredCerts([]);
        setLoading(false);
        return;
      }
      
      const certs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Certificate[];
      
      console.log(`Loaded ${certs.length} certificates`);
      setCertificates(certs);
      setFilteredCerts(certs);
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error loading certificates:', error);
      
      // Check for specific Firebase errors
      if (error instanceof Error) {
        if (error.message.includes('index')) {
          console.error('Firestore index required. Please create an index for the "certificates" collection ordered by "createdAt" descending.');
          alert('Database index required. Please check the console for details.');
        } else if (error.message.includes('permission')) {
          console.error('Permission denied. Please check Firestore security rules.');
          alert('Permission denied. Please check your Firebase configuration.');
        }
      }
      
      setCertificates([]);
      setFilteredCerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert: Certificate) => {
    try {
      console.log('Downloading certificate:', cert);
      
      // Lazy load PDF generator only when needed
      const { generateCertificatePDF } = await import('@/lib/pdf-generator');
      
      const pdfBytes = await generateCertificatePDF({
        certificateId: cert.certificateId,
        recipientName: cert.recipientName,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        issuerName: cert.issuerName,
        institutionName: cert.institutionName,
        instructorName: cert.instructorName || '',
        expiryDate: cert.expiryDate || '',
        durationFrom: cert.durationFrom || '',
        durationTo: cert.durationTo || '',
        grade: cert.grade || '',
        template: cert.template || 'academic',
        logoUrl: cert.logoUrl || '',
        signatureUrl: cert.signatureUrl || '',
        qrPosition: cert.qrPosition || 'bottom-right',
        logoPosition: cert.logoPosition || 'top-center',
        signaturePosition: cert.signaturePosition || 'bottom-center',
      });

      console.log('PDF generated, size:', pdfBytes.length);

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${cert.certificateId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert(`Failed to download certificate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRevoke = async (cert: Certificate) => {
    if (!confirm(`Are you sure you want to revoke the certificate for ${cert.recipientName}?`)) {
      return;
    }

    try {
      // Update Firebase database only (no blockchain transaction needed)
      const certRef = doc(db, 'certificates', cert.id);
      await updateDoc(certRef, { 
        isRevoked: true,
        revokedAt: Date.now(),
        revokedBy: 'admin' // You can add user authentication later
      });
      
      loadCertificates();
      alert('Certificate revoked successfully');
    } catch (error) {
      console.error('Error revoking certificate:', error);
      alert('Failed to revoke certificate');
    }
  };

  const handleRestore = async (cert: Certificate) => {
    if (!confirm(`Are you sure you want to restore the certificate for ${cert.recipientName}?`)) {
      return;
    }

    try {
      const certRef = doc(db, 'certificates', cert.id);
      await updateDoc(certRef, { 
        isRevoked: false,
        revokedAt: null,
        revokedBy: null,
        restoredAt: Date.now(),
        restoredBy: 'admin'
      });
      
      loadCertificates();
      alert('Certificate restored successfully');
    } catch (error) {
      console.error('Error restoring certificate:', error);
      alert('Failed to restore certificate');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white">Issued Certificates</h1>
        <p className="text-gray-300 text-lg">Manage all issued certificates</p>
      </motion.div>

      {certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, course, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-2 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 transition-smooth"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block"
          >
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="border-b-2 border-gray-700 bg-gray-800">
                    <tr>
                      <th className="text-left p-4 text-xs font-bold text-white uppercase tracking-wide">
                        Recipient
                      </th>
                      <th className="text-left p-4 text-xs font-bold text-white uppercase tracking-wide">
                        Course
                      </th>
                      <th className="text-left p-4 text-xs font-bold text-white uppercase tracking-wide">
                        Issue Date
                      </th>
                      <th className="text-left p-4 text-xs font-bold text-white uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-right p-4 text-xs font-bold text-white uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCerts.map((cert, index) => (
                      <motion.tr
                        key={cert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="border-b border-gray-700 hover:bg-gray-800 transition-smooth"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">{cert.recipientName}</p>
                            <p className="text-xs text-gray-400 font-mono">{cert.certificateId}</p>
                            {cert.isRevoked && cert.revokedAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                Revoked: {new Date(cert.revokedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 text-sm">{cert.courseName}</td>
                        <td className="p-4 text-gray-300 text-sm">{cert.issueDate}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${
                              cert.isRevoked
                                ? 'bg-gray-700 text-gray-300 border border-gray-600'
                                : 'bg-white text-black border border-white'
                            }`}
                          >
                            {cert.isRevoked ? (
                              <>
                                <XCircle className="w-3 h-3" />
                                Revoked
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownload(cert)}
                              className="text-gray-400 hover:text-white transition-smooth"
                              title="Download Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {!cert.isRevoked ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRevoke(cert)}
                                className="text-gray-400 hover:text-white transition-smooth"
                                title="Revoke Certificate"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRestore(cert)}
                                className="text-gray-400 hover:text-white transition-smooth"
                                title="Restore Certificate"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:hidden space-y-4"
          >
            {filteredCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="font-medium text-white">{cert.recipientName}</p>
                      <p className="text-sm text-gray-300">{cert.courseName}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{cert.certificateId}</p>
                      {cert.isRevoked && cert.revokedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Revoked: {new Date(cert.revokedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{cert.issueDate}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${
                          cert.isRevoked
                            ? 'bg-gray-700 text-gray-300 border border-gray-600'
                            : 'bg-white text-black border border-white'
                        }`}
                      >
                        {cert.isRevoked ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            Revoked
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(cert)}
                        className="flex-1 gap-2 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 text-white transition-smooth"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      {!cert.isRevoked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevoke(cert)}
                          className="flex-1 gap-2 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 text-white transition-smooth"
                        >
                          <Ban className="w-4 h-4" />
                          Revoke
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(cert)}
                          className="flex-1 gap-2 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 text-white transition-smooth"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
