// Polyfill for crypto in browser environment
// Node's crypto module is used for SHA256 hashing

export function createHash(algorithm: string) {
  if (typeof window !== 'undefined') {
    // Browser environment - use Web Crypto API
    return {
      update: (data: string) => ({
        digest: async (encoding: string) => {
          const encoder = new TextEncoder();
          const dataBuffer = encoder.encode(data);
          const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
      })
    };
  } else {
    // Node environment - use crypto module
    const crypto = require('crypto');
    return crypto.createHash(algorithm);
  }
}
