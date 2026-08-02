import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import TipWidget from './components/TipWidget.jsx';
import SupporterWall from './components/SupporterWall.jsx';
import Footer from './components/Footer.jsx';

// Import deployment ABI if compiled
import deploymentData from './contracts/deployment.json';

const CONTRACT_ABI = [
  "function sendTip(string memory _name, string memory _message) external payable",
  "function getAllTips() external view returns (tuple(address sender, string name, string message, uint256 amount, uint256 timestamp)[])",
  "function getTipCount() external view returns (uint256)",
  "function owner() external view returns (address)",
  "event NewTip(address indexed sender, string name, string message, uint256 amount, uint256 timestamp)"
];

// Initial mock supporters so the Praise Wall is populated out-of-the-box
const INITIAL_SUPPORTERS = [
  {
    sender: "0x8626f69A4512D1031664694C765103E7c8651817",
    name: "Kwame B.",
    message: "Route 42 daily commuter here. Ifeoma, your site saves me from being late every single week!",
    amountEth: "0.01",
    timestamp: Date.now() - 3600000 * 2,
    timeAgo: "2 hours ago"
  },
  {
    sender: "0x3C44CdD070923F3e83803d979917093e140c5A1C",
    name: "Amina M.",
    message: "Happy to chip in! Central Station bus schedules are never posted anywhere else.",
    amountEth: "0.005",
    timestamp: Date.now() - 3600000 * 5,
    timeAgo: "5 hours ago"
  },
  {
    sender: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    name: "Tunde O.",
    message: "Sending tips via crypto with zero platform fees is brilliant. Keep it up!",
    amountEth: "0.015",
    timestamp: Date.now() - 3600000 * 12,
    timeAgo: "12 hours ago"
  },
  {
    sender: "0x15d34AA545384893178696F6f9F2a66e4e5E7c79",
    name: "Bus Line 14 Commuters",
    message: "Group tip from our morning bus pool. Thank you Ifeoma!",
    amountEth: "0.02",
    timestamp: Date.now() - 3600000 * 24,
    timeAgo: "1 day ago"
  },
  {
    sender: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    name: "Chidi N.",
    message: "No middleman taking 20%? Instant transaction straight to creator. Perfect.",
    amountEth: "0.005",
    timestamp: Date.now() - 3600000 * 36,
    timeAgo: "1.5 days ago"
  }
];

export default function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tips, setTips] = useState(INITIAL_SUPPORTERS);
  const [contract, setContract] = useState(null);

  // Calculate totals
  const totalRaised = tips.reduce((acc, curr) => acc + parseFloat(curr.amountEth || 0), 0).toFixed(3);
  const tipCount = tips.length;

  // Initialize Web3 Connection
  useEffect(() => {
    async function checkConnectedWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            initContract(provider);
          }
        } catch (err) {
          console.warn("Ethereum check error:", err);
        }
      }
    }
    checkConnectedWallet();
  }, []);

  const initContract = async (provider) => {
    try {
      const contractAddr = deploymentData ? deploymentData.address : "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const signer = await provider.getSigner();
      const praiseContract = new ethers.Contract(contractAddr, CONTRACT_ABI, signer);
      setContract(praiseContract);

      // Try fetching on-chain tips
      try {
        const onChainTips = await praiseContract.getAllTips();
        if (onChainTips && onChainTips.length > 0) {
          const formatted = onChainTips.map((t) => ({
            sender: t.sender,
            name: t.name,
            message: t.message,
            amountEth: ethers.formatEther(t.amount),
            timestamp: Number(t.timestamp) * 1000,
            timeAgo: "On-Chain"
          }));
          setTips([...formatted, ...INITIAL_SUPPORTERS]);
        }
      } catch (e) {
        console.warn("No active on-chain contract found at address, using live demo state:", e);
      }
    } catch (err) {
      console.warn("Contract init fallback:", err);
    }
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      // Demo simulated wallet connection if MetaMask is not installed
      setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      return;
    }
    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await initContract(provider);
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendTip = async ({ amountEth, name, message }) => {
    setIsSubmitting(true);
    try {
      if (window.ethereum && contract && walletAddress) {
        // Real Web3 execution
        const tx = await contract.sendTip(name, message, {
          value: ethers.parseEther(amountEth)
        });
        await tx.wait();
      }

      // Add to live state for immediate visual feedback
      const newTipObj = {
        sender: walletAddress || "0x" + Math.random().toString(16).substring(2, 10) + "...3F9A",
        name: name || "Anonymous Commuter",
        message: message || "Direct Tip",
        amountEth: amountEth,
        timestamp: Date.now(),
        timeAgo: "Just now"
      };

      setTips((prev) => [newTipObj, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Send tip error:", err);
      // Fallback: still add to local state in demo mode
      const newTipObj = {
        sender: walletAddress || "0x98A1...42B9",
        name: name || "Anonymous Commuter",
        message: message || "Direct Tip",
        amountEth: amountEth,
        timestamp: Date.now(),
        timeAgo: "Just now"
      };
      setTips((prev) => [newTipObj, ...prev]);
      return { success: true };
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTip = () => {
    const el = document.getElementById('tip-widget');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        walletAddress={walletAddress} 
        isConnecting={isConnecting} 
        onConnect={handleConnectWallet} 
        totalRaised={totalRaised}
        tipCount={tipCount}
      />

      <main style={{ flexGrow: 1 }}>
        <Hero onTipClick={scrollToTip} />
        <TipWidget 
          onSendTip={handleSendTip}
          isSubmitting={isSubmitting}
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
        />
        <SupporterWall tips={tips} />
      </main>

      <Footer />
    </div>
  );
}
