import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import TipWidget from './components/TipWidget.jsx';
import SupporterWall from './components/SupporterWall.jsx';
import Footer from './components/Footer.jsx';

import deploymentData from './contracts/deployment.json';

const CONTRACT_ABI = [
  "function sendTip(string memory _name, string memory _note) external payable",
  "function withdraw() external",
  "function getAllTips() external view returns (tuple(address sender, string name, string note, uint256 amount, uint256 timestamp)[])",
  "function getTipCount() external view returns (uint256)",
  "function owner() external view returns (address)",
  "event NewTip(address indexed sender, string name, string note, uint256 amount, uint256 timestamp)"
];

const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111 in hex

/**
 * Helper to identify if an error is a user-rejected wallet prompt (Test Case 8)
 */
export function isUserRejection(err) {
  if (!err) return false;
  const code = err.code || err?.info?.error?.code || err?.cause?.code || err?.error?.code;
  const msg = (err.message || err?.info?.error?.message || '').toLowerCase();
  return (
    code === 4001 ||
    code === 'ACTION_REJECTED' ||
    msg.includes('user rejected') ||
    msg.includes('user denied') ||
    msg.includes('declined') ||
    msg.includes('rejected transaction') ||
    msg.includes('action_rejected')
  );
}

export default function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tips, setTips] = useState([]);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [contractBalance, setContractBalance] = useState('0');
  const [withdrawMsg, setWithdrawMsg] = useState(null);

  // Calculate totals from event log populated state
  const totalRaised = tips.reduce((acc, curr) => acc + parseFloat(curr.amountEth || 0), 0).toFixed(3);
  const tipCount = tips.length;

  /**
   * Test Case 1: Populate supporter wall exclusively from decoded contract event logs
   */
  const fetchEventLogs = async (praiseContract) => {
    try {
      const filter = praiseContract.filters.NewTip();
      const eventLogs = await praiseContract.queryFilter(filter, 0, "latest");
      
      const decodedEntries = eventLogs.map((log) => {
        // Log args carry: sender, name, note, amount, timestamp
        const { sender, name, note, amount, timestamp } = log.args || {};
        const parsedAmount = amount ? ethers.formatEther(amount) : "0";
        const parsedNote = note || "Thank you Ifeoma for keeping city transit accessible!";

        return {
          sender: sender,
          name: name || "Anonymous Supporter",
          note: parsedNote,
          message: parsedNote,
          amountEth: parsedAmount,
          timestamp: Number(timestamp || 0) * 1000,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          timeAgo: "Verified On-Chain Log"
        };
      });

      // Show newest on-chain event logs first
      setTips(decodedEntries.reverse());
    } catch (err) {
      console.warn("Error decoding contract event logs:", err);
    }
  };

  // Initialize Web3 Connection
  useEffect(() => {
    async function checkConnectedWallet() {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          const network = await web3Provider.getNetwork();
          setChainId(Number(network.chainId));
          setNetworkName(network.name === 'unknown' ? 'Local/Sepolia' : network.name);

          const accounts = await web3Provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            await initContract(web3Provider, accounts[0]);
          }

          // Listen for network & account changes
          if (window.ethereum.on) {
            window.ethereum.on('chainChanged', () => window.location.reload());
            window.ethereum.on('accountsChanged', (newAccounts) => {
              if (newAccounts.length > 0) {
                setWalletAddress(newAccounts[0]);
                initContract(web3Provider, newAccounts[0]);
              } else {
                setWalletAddress('');
              }
            });
          }
        } catch (err) {
          console.warn("Ethereum provider check error:", err);
        }
      }
    }
    checkConnectedWallet();
  }, []);

  const initContract = async (web3Provider, userAddr) => {
    try {
      const contractAddr = deploymentData ? deploymentData.address : "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const signer = await web3Provider.getSigner();
      const praiseContract = new ethers.Contract(contractAddr, CONTRACT_ABI, signer);
      setContract(praiseContract);

      // Check owner status
      try {
        const ownerAddr = await praiseContract.owner();
        if (userAddr && ownerAddr && userAddr.toLowerCase() === ownerAddr.toLowerCase()) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        
        // Fetch contract balance
        const balanceWei = await web3Provider.getBalance(contractAddr);
        setContractBalance(ethers.formatEther(balanceWei));
      } catch (e) {
        console.warn("Could not check contract owner/balance:", e);
      }

      // Populate supporter wall from decoded event logs
      await fetchEventLogs(praiseContract);

      // Listen for real-time NewTip events and reconcile wall
      praiseContract.on("NewTip", async () => {
        await fetchEventLogs(praiseContract);
        if (web3Provider) {
          const balanceWei = await web3Provider.getBalance(contractAddr);
          setContractBalance(ethers.formatEther(balanceWei));
        }
      });
    } catch (err) {
      console.warn("Contract initialization error:", err);
    }
  };

  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or a Web3 browser extension to connect your wallet.");
      return;
    }
    try {
      setIsConnecting(true);
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await initContract(web3Provider, accounts[0]);
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetworkToSepolia = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: 'Sepolia Test Network',
              nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
        }
      }
    }
  };

  /**
   * Test Cases 2, 8 & 9:
   * - Enforces note length check before send
   * - Identifies user prompt rejection in its own branch (Test Case 8)
   * - Inspects transaction receipt status (Test Case 9)
   * - Reconciles supporter wall from decoded logs rather than standing in for it (Test Case 1)
   */
  const handleSendTip = async ({ amountEth, name, note }) => {
    setIsSubmitting(true);
    try {
      if (!contract) {
        throw new Error("Wallet not connected or contract not initialized.");
      }

      // Test Case 2 client-side pre-validation matching contract bound (max 280 chars)
      if (note && note.length > 280) {
        return {
          success: false,
          errorType: 'NOTE_TOO_LONG',
          message: "Note exceeds contract maximum length bound of 280 characters."
        };
      }

      // Send transaction
      const tx = await contract.sendTip(name || "Anonymous Supporter", note || "Thank you Ifeoma!", {
        value: ethers.parseEther(amountEth)
      });

      // Test Case 9: Inspect receipt status after transaction resolves
      const receipt = await tx.wait();
      const status = receipt ? Number(receipt.status) : 0;

      if (status !== 1) {
        // Reverted transaction branch
        return {
          success: false,
          reverted: true,
          message: `Transaction reverted on-chain (receipt status ${status}). Tip was not processed.`
        };
      }

      // Successful transaction branch: decode logs to reconcile wall
      await fetchEventLogs(contract);

      return {
        success: true,
        receipt: receipt,
        message: `🎉 Success! Tip of ${amountEth} ETH confirmed on-chain!`
      };

    } catch (err) {
      console.error("Send tip error:", err);

      // Test Case 8: Dedicated branch for rejected wallet prompt
      if (isUserRejection(err)) {
        return {
          success: false,
          rejected: true,
          message: "Wallet Prompt Declined: You cancelled the transaction prompt in your wallet."
        };
      }

      return {
        success: false,
        error: err,
        message: err.reason || err.message || "Transaction failed."
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!contract || !isOwner) return;
    try {
      const tx = await contract.withdraw();
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setWithdrawMsg("Successfully withdrew accumulated balance to Ifeoma's wallet!");
        if (provider) {
          const balanceWei = await provider.getBalance(contract.target || contract.address);
          setContractBalance(ethers.formatEther(balanceWei));
        }
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      setWithdrawMsg(`Withdraw failed: ${err.message}`);
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
        chainId={chainId}
        networkName={networkName}
        onSwitchNetwork={switchNetworkToSepolia}
      />

      {/* Owner Dashboard Banner if Ifeoma is connected */}
      {isOwner && (
        <div style={{ background: '#FFD05B', borderBottom: '3px solid #121212', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
            👑 Owner Mode Active: You are connected as Ifeoma (Contract Owner). Contract Balance: <strong>{contractBalance} ETH</strong>
          </div>
          <button 
            onClick={handleWithdraw} 
            className="brutal-btn brutal-btn-blue" 
            style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
          >
            Withdraw Balance ({contractBalance} ETH)
          </button>
        </div>
      )}

      {withdrawMsg && (
        <div style={{ background: '#A3C7FF', borderBottom: '3px solid #121212', padding: '0.5rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>
          {withdrawMsg}
        </div>
      )}

      <main style={{ flexGrow: 1 }}>
        <Hero onTipClick={scrollToTip} />
        <TipWidget 
          onSendTip={handleSendTip}
          isSubmitting={isSubmitting}
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
          chainId={chainId}
          onSwitchNetwork={switchNetworkToSepolia}
        />
        <SupporterWall tips={tips} />
      </main>

      <Footer />
    </div>
  );
}

