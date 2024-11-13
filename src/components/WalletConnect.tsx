import React from 'react';
import { createWalletClient, custom } from 'viem';
import { baseGoerli } from 'viem/chains';
import { useDrawingStore } from '../store/useDrawingStore';
import { Wallet } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { walletAddress, setWalletAddress } = useDrawingStore();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      const client = createWalletClient({
        chain: baseGoerli,
        transport: custom(window.ethereum)
      });

      const [address] = await client.requestAddresses();
      setWalletAddress(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
    >
      <Wallet className="w-4 h-4" />
      {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
    </button>
  );
};

export default WalletConnect;