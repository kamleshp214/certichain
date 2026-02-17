export interface Certificate {
  id: string;
  certificateId: string;
  recipientName: string;
  courseName: string;
  institutionName: string;
  issuerName: string;
  instructorName?: string;
  issueDate: string;
  expiryDate?: string;
  durationFrom?: string;
  durationTo?: string;
  grade?: string;
  template: 'academic' | 'corporate' | 'premium' | 'minimal';
  hash: string;
  txHash?: string;
  isRevoked: boolean;
  revokedAt?: number;
  revokedBy?: string;
  createdAt: number;
  logoUrl?: string;
  signatureUrl?: string;
  qrPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  logoPosition?: 'top-left' | 'top-center' | 'top-right';
  signaturePosition?: 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface VerificationLog {
  id: string;
  certificateId: string;
  timestamp: number;
  result: 'verified' | 'tampered' | 'revoked' | 'expired' | 'not_found';
  ipAddress?: string;
}

export interface DashboardStats {
  totalIssued: number;
  activeOnChain: number;
  revokedCount: number;
  recentVerifications: number;
}
