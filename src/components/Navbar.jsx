import React from 'react';
import { Wallet, Heart, Bus, CheckCircle, Globe, AlertTriangle } from 'lucide-react';

export default function Navbar({ walletAddress, isConnecting, onConnect, totalRaised, tipCount, chainId, networkName, onSwitchNetwork }) {
  const isSepoliaOrLocal = chainId === 11155111 || chainId === 31337;

  return (
    <header style={{ borderBottom: '3px solid #121212', background: '#F5F2EB', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brutal-badge brutal-card-yellow" style={{ fontSize: '1.25rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bus size={22} strokeWidth={2.5} />
            <span>THE PRAISE BOARD</span>
          </div>
          <span className="handwritten" style={{ fontSize: '1.1rem', color: '#121212', transform: 'rotate(-2deg)', background: '#A3C7FF', padding: '0.1rem 0.5rem', border: '2px solid #121212' }}>
            city transit
          </span>
        </div>

        {/* Center Nav Pills */}
        <nav style={{ display: 'flex', alignItems: 'center', border: '3px solid #121212', background: '#FFFFFF', boxShadow: '3px 3px 0px #121212' }}>
          <a href="#hero" style={{ padding: '0.4rem 0.85rem', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', textDecoration: 'none', color: '#121212', borderRight: '2px solid #121212' }}>
            Story
          </a>
          <a href="#tip-widget" style={{ padding: '0.4rem 0.85rem', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', textDecoration: 'none', color: '#121212', borderRight: '2px solid #121212', background: '#FFD05B' }}>
            Tip Now
          </a>
          <a href="#supporter-wall" style={{ padding: '0.4rem 0.85rem', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', textDecoration: 'none', color: '#121212' }}>
            Supporter Wall
          </a>
        </nav>

        {/* Ticker, Network Indicator & Wallet Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="brutal-badge brutal-card-coral" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Heart size={14} fill="#121212" />
            <span>{totalRaised} ETH Raised ({tipCount} Tips)</span>
          </div>

          {/* Network Indicator Pill */}
          {walletAddress && (
            chainId ? (
              isSepoliaOrLocal ? (
                <div className="brutal-badge brutal-card-teal" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.65rem' }}>
                  <Globe size={13} />
                  <span>{chainId === 11155111 ? 'Sepolia Testnet' : 'Hardhat Local'}</span>
                </div>
              ) : (
                <button
                  onClick={onSwitchNetwork}
                  className="brutal-badge brutal-card-coral"
                  style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.4rem 0.65rem' }}
                  title="Click to switch wallet network to Sepolia"
                >
                  <AlertTriangle size={13} />
                  <span>Wrong Network (Switch to Sepolia)</span>
                </button>
              )
            ) : null
          )}

          <button 
            onClick={onConnect} 
            disabled={isConnecting}
            className="brutal-btn brutal-btn-yellow" 
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Wallet size={16} />
            {walletAddress ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={14} color="#008000" />
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            ) : isConnecting ? (
              "Connecting..."
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

