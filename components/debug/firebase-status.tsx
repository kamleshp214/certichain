'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function FirebaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('Checking Firebase connection...');
  const [certCount, setCertCount] = useState<number>(0);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Check if Firebase config is valid
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      };

      if (!config.apiKey || !config.projectId) {
        setStatus('error');
        setMessage('Firebase configuration missing. Check environment variables.');
        return;
      }

      // Try to fetch certificates
      const certsRef = collection(db, 'certificates');
      const q = query(certsRef, limit(1));
      const snapshot = await getDocs(q);
      
      setCertCount(snapshot.size);
      setStatus('connected');
      setMessage(`Connected to Firebase. Found ${snapshot.size} certificate(s) in database.`);
    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          setMessage('Permission denied. Update Firestore security rules.');
        } else if (error.message.includes('index')) {
          setMessage('Index required. Create Firestore index for createdAt field.');
        } else {
          setMessage(`Error: ${error.message}`);
        }
      } else {
        setMessage('Unknown error connecting to Firebase.');
      }
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border-2 max-w-sm ${
      status === 'checking' ? 'bg-gray-800 border-gray-600' :
      status === 'connected' ? 'bg-green-900 border-green-600' :
      'bg-red-900 border-red-600'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1 ${
          status === 'checking' ? 'bg-gray-400 animate-pulse' :
          status === 'connected' ? 'bg-green-400' :
          'bg-red-400'
        }`} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white mb-1">
            {status === 'checking' ? 'Checking...' :
             status === 'connected' ? 'Firebase Connected' :
             'Firebase Error'}
          </p>
          <p className="text-xs text-gray-300">{message}</p>
          {status === 'error' && (
            <button
              onClick={checkConnection}
              className="mt-2 text-xs text-white underline hover:no-underline"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
