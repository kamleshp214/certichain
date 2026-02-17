export interface CertificateData {
  recipientName: string;
  courseName: string;
  institutionName: string;
  issuerName: string;
  instructorName?: string;
  certificateId: string;
  issueDate: string;
  expiryDate?: string;
  durationFrom?: string;
  durationTo?: string;
  grade?: string;
}

export async function generateCertificateHash(data: CertificateData): Promise<string> {
  const content = `${data.certificateId}|${data.recipientName}|${data.courseName}|${data.institutionName}|${data.issuerName}|${data.issueDate}`;
  
  if (typeof window !== 'undefined') {
    // Browser environment - use Web Crypto API
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node environment - use crypto module
    const { createHash } = await import('crypto');
    return createHash('sha256').update(content).digest('hex');
  }
}

export function generateCertificateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `CERT-${timestamp}-${random}`.toUpperCase();
}
