import { ethers, BrowserProvider, Contract } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const CONTRACT_ABI = [
  "function issueCertificate(string memory certificateId, bytes32 certificateHash) public",
  "function verifyCertificate(string memory certificateId) public view returns (bytes32, bool, bool, uint256)",
  "function revokeCertificate(string memory certificateId) public",
  "function getCertificateCount() public view returns (uint256)"
];

export async function getContract() {
  // Ensure this only runs on client
  if (typeof window === 'undefined') {
    throw new Error('Blockchain operations only available on client');
  }
  
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function getReadOnlyContract() {
  // Ensure this only runs on client
  if (typeof window === 'undefined') {
    throw new Error('Blockchain operations only available on client');
  }
  
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc-amoy.polygon.technology'
  );
  
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export async function issueCertificateOnChain(certificateId: string, hash: string) {
  const contract = await getContract();
  const tx = await contract.issueCertificate(certificateId, hash);
  await tx.wait();
  return tx.hash;
}

export async function verifyCertificateOnChain(certificateId: string) {
  const contract = await getReadOnlyContract();
  const [hash, isValid, isRevoked, timestamp] = await contract.verifyCertificate(certificateId);
  
  return {
    hash,
    isValid,
    isRevoked,
    timestamp: Number(timestamp),
  };
}

export async function revokeCertificateOnChain(certificateId: string) {
  const contract = await getContract();
  const tx = await contract.revokeCertificate(certificateId);
  await tx.wait();
  return tx.hash;
}

export async function getCertificateCount() {
  const contract = await getReadOnlyContract();
  const count = await contract.getCertificateCount();
  return Number(count);
}
