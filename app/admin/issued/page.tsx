'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types/certificate';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Ban, CheckCircle, XCircle } from 'lucide-react';
import { generateCertificatePDF } from '@/lib/pdf-generator';
import { revokeCertificateOnChain } from '@/lib/blockchain';
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
    try {
      const certsRef = collection(db, 'certificates');
      const q = query(certsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const certs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Certificate[];
      
      setCertificates(certs);
      setFilteredCerts(certs);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert: Certificate) => {
    try {
      const pdfBytes = await generateCertificatePDF({
        certificateId: cert.certificateId,
        recipientName: cert.recipientName,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        issuerName: cert.issuerName,
        template: cert.template,
        logoUrl: cert.logoUrl,
        signatureUrl: cert.signatureUrl,
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${cert.certificateId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate');
    }
  };

  const handleRevoke = async (cert: Certificate) => {
    if (!confirm(`Are you sure you want to revoke the certificate for ${cert.recipientName}?`)) {
      return;
    }

    try {
      await revokeCertificateOnChain(cert.certificateId);
      
      const certRef = doc(db, 'certificates', cert.id);
      await updateDoc(certRef, { isRevoked: true });
      
      loadCertificates();
      alert('Certificate revoked successfully');
    } catch (error) {
      console.error('Error revoking certificate:', error);
      alert('Failed to revoke certificate');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-900 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Issued Certificates</h1>
        <p className="text-gray-400">Manage all issued certificates</p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search by name, course, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="border-b border-gray-800">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">
                        Recipient
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">
                        Course
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">
                        Issue Date
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">
                        Status
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-gray-400">
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
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-800 hover:bg-gray-800/50"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white">{cert.recipientName}</p>
                            <p className="text-sm text-gray-500 font-mono">{cert.certificateId}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{cert.courseName}</td>
                        <td className="p-4 text-gray-300">{cert.issueDate}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                              cert.isRevoked
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-green-500/20 text-green-400'
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
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            {!cert.isRevoked && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRevoke(cert)}
                              >
                                <Ban className="w-4 h-4" />
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
          </div>

          <div className="md:hidden space-y-4">
            {filteredCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <p className="font-medium text-white">{cert.recipientName}</p>
                      <p className="text-sm text-gray-400">{cert.courseName}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">{cert.certificateId}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{cert.issueDate}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          cert.isRevoked
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
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
                        className="flex-1 gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      {!cert.isRevoked && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(cert)}
                          className="flex-1 gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          Revoke
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
