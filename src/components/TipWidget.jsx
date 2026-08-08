import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Coins, AlertTriangle, ExternalLink, HelpCircle } from 'lucide-react';
import deploymentData from '../contracts/deployment.json';

export default function TipWidget({ onSendTip, isSubmitting, walletAddress, onConnectWallet, chainId, onSwitchNetwork }) {
  const [selectedPreset, setSelectedPreset] = useState('0.005');
  const [customAmount, setCustomAmount] = useState('');
  const [supporterName, setSupporterName] = useState('');
  const [note, setNote] = useState('');
  const [txSuccessMsg, setTxSuccessMsg] = useState(null);
  const [txErrorMsg, setTxErrorMsg] = useState(null);
  const [promptRejectedMsg, setPromptRejectedMsg] = useState(null);
  const [showFaucetHelp, setShowFaucetHelp] = useState(false);

  const beneficiaryAddr = deploymentData?.beneficiary || "0x720C021b221347220A4F1Fa38ed21b0593fc69CC";
  const formattedBeneficiary = `${beneficiaryAddr.substring(0, 6)}...${beneficiaryAddr.substring(beneficiaryAddr.length - 4)}`;


  const presets = [
    { eth: '0.001', label: '0.001 ETH', desc: '☕ Quick Coffee Tip (~$3)' },
    { eth: '0.005', label: '0.005 ETH', desc: '🚌 Bus Supporter (~$15)' },
    { eth: '0.01', label: '0.01 ETH', desc: '⚡ Champion Sponsor (~$30)' },
    { eth: 'custom', label: 'Custom', desc: '✨ Pick Amount' }
  ];

  const isWrongNetwork = walletAddress && chainId && (chainId !== 11155111 && chainId !== 31337);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTxSuccessMsg(null);
    setTxErrorMsg(null);
    setPromptRejectedMsg(null);

    const ethValue = selectedPreset === 'custom' ? customAmount : selectedPreset;
    if (!ethValue || parseFloat(ethValue) <= 0) {
      setTxErrorMsg('Please select or enter a valid ETH tip amount.');
      return;
    }

    if (note.length > 280) {
      setTxErrorMsg('Note is too long! The contract enforces a maximum of 280 characters.');
      return;
    }

    try {
      const result = await onSendTip({
        amountEth: ethValue,
        name: supporterName.trim() || 'Anonymous Supporter',
        note: note.trim() || 'Thank you Ifeoma for keeping city transit accessible!'
      });

      if (result && result.success) {
        setTxSuccessMsg(result.message || `🎉 Success! Your tip was confirmed on-chain and added to the Praise Wall!`);
        setNote('');
        setSupporterName('');
      } else if (result && result.rejected) {
        // Test Case 8: Explicit user prompt rejection branch
        setPromptRejectedMsg(result.message || "Wallet Prompt Declined: Transaction was cancelled in your wallet.");
      } else if (result && result.reverted) {
        // Test Case 9: Explicit transaction revert branch
        setTxErrorMsg(result.message || "Transaction reverted on-chain. Tip was not processed.");
      } else if (result && result.message) {
        setTxErrorMsg(result.message);
      }
    } catch (err) {
      setTxErrorMsg(err.message || 'Transaction failed. Please try again.');
    }
  };

  return (
    <section id="tip-widget" style={{ padding: '3rem 1.5rem', background: '#EAE6DB', borderBottom: '3px solid #121212', position: 'relative' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="brutal-badge brutal-card-yellow" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>DIRECT WEB3 TRANSFERS</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>SEND A TIP & JOIN THE WALL</h2>
          <p className="handwritten" style={{ fontSize: '1.25rem', color: '#121212', marginTop: '0.25rem' }}>
            100% of your ETH goes straight to Ifeoma's wallet address.
          </p>
        </div>

        {/* Neo-brutalist Main Tip Card */}
        <div className="brutal-card brutal-card-yellow" style={{ padding: '2rem', position: 'relative' }}>
          
          {/* Wrong Network Warning Banner */}
          {isWrongNetwork && (
            <div className="brutal-card brutal-card-coral" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
                <AlertTriangle size={20} />
                <span>Wrong Network Detected! Connect to Sepolia Testnet to send a tip.</span>
              </div>
              <button
                type="button"
                onClick={onSwitchNetwork}
                className="brutal-btn brutal-btn-yellow"
                style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
              >
                Switch to Sepolia Network
              </button>
            </div>
          )}

          {/* Testnet Faucet Assistance Banner */}
          <div style={{ marginBottom: '1.25rem', textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setShowFaucetHelp(!showFaucetHelp)}
              style={{ background: 'none', border: 'none', textDecoration: 'underline', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <HelpCircle size={15} /> Need Sepolia Testnet ETH?
            </button>
          </div>

          {showFaucetHelp && (
            <div className="brutal-card brutal-card-teal" style={{ padding: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
              <p style={{ marginBottom: '0.5rem', textTransform: 'uppercase' }}>🚰 Free Sepolia Testnet Faucets for Commuters & Testers:</p>
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                <li><a href="https://faucet.quicknode.com/drip" target="_blank" rel="noreferrer" style={{ color: '#121212' }}>QuickNode Sepolia Faucet <ExternalLink size={12} /></a></li>
                <li><a href="https://sepoliafaucet.com" target="_blank" rel="noreferrer" style={{ color: '#121212' }}>Alchemy Sepolia Faucet <ExternalLink size={12} /></a></li>
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Select Preset */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                1. Select Tip Amount (ETH)
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
                {presets.map((preset) => {
                  const isSelected = selectedPreset === preset.eth;
                  return (
                    <button
                      key={preset.eth}
                      type="button"
                      onClick={() => setSelectedPreset(preset.eth)}
                      className="brutal-card"
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        background: isSelected ? '#121212' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#121212',
                        border: '3px solid #121212',
                        boxShadow: isSelected ? '4px 4px 0px #FF7E67' : '3px 3px 0px #121212',
                        transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 900, fontSize: '1.15rem' }}>{preset.label}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.2rem', fontWeight: 600 }}>{preset.desc}</div>
                    </button>
                  );
                })}
              </div>

              {selectedPreset === 'custom' && (
                <div style={{ marginTop: '1rem' }}>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Enter custom ETH amount (e.g. 0.008)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="brutal-input"
                    required
                  />
                </div>
              )}
            </div>

            {/* Step 2: Supporter Name & Note */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  2. Your Name / Alias (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kwame B. (Route 42 Commuter)"
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  className="brutal-input"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    3. Note / Message to Ifeoma
                  </label>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: note.length > 280 ? '#D32F2F' : '#666' }}>
                    {note.length}/280
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Thanks for saving my morning commute!"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="brutal-input"
                  maxLength={280}
                />
              </div>
            </div>

            {/* Success Banner */}
            {txSuccessMsg && (
              <div className="brutal-card brutal-card-teal" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                <CheckCircle2 size={24} />
                <div>{txSuccessMsg}</div>
              </div>
            )}

            {/* Test Case 8: Prompt Rejection Specific Branch Banner */}
            {promptRejectedMsg && (
              <div className="brutal-card brutal-card-yellow" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                <AlertTriangle size={24} color="#D32F2F" />
                <div>{promptRejectedMsg}</div>
              </div>
            )}

            {/* General Error Banner */}
            {txErrorMsg && (
              <div className="brutal-card brutal-card-coral" style={{ padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                <AlertCircle size={24} />
                <div>{txErrorMsg}</div>
              </div>
            )}

            {/* Submit / Connect Wallet Action */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderTop: '2px dashed #121212', paddingTop: '1.25rem' }}>
              
              <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Coins size={18} />
                <span>Recipient Wallet: <code>{formattedBeneficiary}</code> (Ifeoma's Direct Address)</span>
              </div>

              {walletAddress ? (
                <button
                  type="submit"
                  disabled={isSubmitting || isWrongNetwork}
                  className="brutal-btn brutal-btn-blue"
                  style={{ fontSize: '1.05rem', padding: '0.85rem 2rem', opacity: isWrongNetwork ? 0.6 : 1 }}
                >
                  {isSubmitting ? (
                    <span>Processing Web3 Tx...</span>
                  ) : isWrongNetwork ? (
                    <span>Switch Network to Send Tip</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send {selectedPreset === 'custom' ? (customAmount || '0') : selectedPreset} ETH Tip</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onConnectWallet}
                  className="brutal-btn brutal-btn-yellow"
                  style={{ fontSize: '1.05rem', padding: '0.85rem 2rem' }}
                >
                  Connect Wallet to Send Tip
                </button>
              )}

            </div>

          </form>

        </div>

      </div>

    </section>
  );
}

