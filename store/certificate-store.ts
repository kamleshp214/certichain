import { create } from 'zustand';

interface CertificateFormData {
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
  logoFile?: File;
  signatureFile?: File;
  logoUrl?: string;
  signatureUrl?: string;
  qrPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  logoPosition?: 'top-left' | 'top-center' | 'top-right';
  signaturePosition?: 'bottom-left' | 'bottom-center' | 'bottom-right';
}

interface CertificateStore {
  formData: CertificateFormData;
  issuingStep: number;
  updateFormData: (data: Partial<CertificateFormData>) => void;
  setIssuingStep: (step: number) => void;
  resetForm: () => void;
}

const initialFormData: CertificateFormData = {
  recipientName: '',
  courseName: '',
  institutionName: '',
  issuerName: '',
  issueDate: new Date().toISOString().split('T')[0],
  template: 'academic',
  qrPosition: 'bottom-right',
  logoPosition: 'top-center',
  signaturePosition: 'bottom-center',
};

export const useCertificateStore = create<CertificateStore>((set) => ({
  formData: initialFormData,
  issuingStep: 0,
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setIssuingStep: (step) => set({ issuingStep: step }),
  resetForm: () => set({ formData: initialFormData, issuingStep: 0 }),
}));
