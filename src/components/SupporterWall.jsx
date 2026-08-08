import React, { useState } from 'react';
import { Heart, Search, Award, Clock, ArrowUpRight, UserCheck, MessageSquare } from 'lucide-react';

export default function SupporterWall({ tips }) {
  const [filter, setFilter] = useState('all'); // 'all', 'top', 'recent'
  const [searchTerm, setSearchTerm] = useState('');

  // Apply filtering & sorting
  let filteredTips = [...tips].filter((tip) => {
    const term = searchTerm.toLowerCase();
    return (
      tip.name.toLowerCase().includes(term) ||
      tip.message.toLowerCase().includes(term) ||
      tip.sender.toLowerCase().includes(term)
    );
  });

  if (filter === 'top') {
    filteredTips.sort((a, b) => parseFloat(b.amountEth) - parseFloat(a.amountEth));
  } else if (filter === 'recent') {
    filteredTips.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Preset card background color rotator
  const bgColors = ['brutal-card-yellow', 'brutal-card-blue', 'brutal-card-purple', 'brutal-card-teal', 'brutal-card-coral'];

  return (
    <section id="supporter-wall" style={{ padding: '3.5rem 1.5rem', background: '#F5F2EB', borderBottom: '3px solid #121212' }}>
      
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <span className="brutal-badge brutal-card-coral" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>LIVE SUPPORTER FEED</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>THE PRAISE WALL</h2>
            <p className="handwritten" style={{ fontSize: '1.2rem', color: '#121212' }}>
              Real-time supporters verified on-chain. Zero hidden platform cut.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#121212' }} />
              <input
                type="text"
                placeholder="Search supporter or note..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="brutal-input"
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', width: '220px' }}
              />
            </div>

            <div style={{ display: 'flex', border: '3px solid #121212', background: '#FFFFFF', boxShadow: '3px 3px 0px #121212' }}>
              <button
                type="button"
                onClick={() => setFilter('all')}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRight: '2px solid #121212',
                  cursor: 'pointer',
                  background: filter === 'all' ? '#FFD05B' : '#FFFFFF'
                }}
              >
                All ({tips.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('top')}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRight: '2px solid #121212',
                  cursor: 'pointer',
                  background: filter === 'top' ? '#FFD05B' : '#FFFFFF'
                }}
              >
                Top Tippers 👑
              </button>
              <button
                type="button"
                onClick={() => setFilter('recent')}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === 'recent' ? '#FFD05B' : '#FFFFFF'
                }}
              >
                Latest ⚡
              </button>
            </div>
          </div>
        </div>

        {/* Supporter Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {filteredTips.length === 0 ? (
            <div className="brutal-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', background: '#FFFFFF' }}>
              <p style={{ fontWeight: 800, fontSize: '1.2rem', uppercase: true }}>No supporters match your search yet.</p>
              <p style={{ marginTop: '0.5rem' }}>Be the first to leave a tip & praise message!</p>
            </div>
          ) : (
            filteredTips.map((tip, idx) => {
              const bgClass = bgColors[idx % bgColors.length];
              const isRotated = idx % 2 === 0 ? 'tilt-left' : 'tilt-right';

              return (
                <div
                  key={idx}
                  className={`brutal-card ${bgClass} ${isRotated}`}
                  style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '210px' }}
                >
                  <div className="tape-strip"></div>

                  <div>
                    {/* Header: Name + Amount Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>{tip.name}</h3>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, marginTop: '0.15rem' }}>
                          <code>{tip.sender.substring(0, 6)}...{tip.sender.substring(tip.sender.length - 4)}</code>
                        </div>
                      </div>

                      <div className="brutal-badge" style={{ background: '#121212', color: '#FFFFFF', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>
                        {tip.amountEth} ETH
                      </div>
                    </div>

                    {/* Supporter Note */}
                    <div style={{ background: '#FFFFFF', border: '2px solid #121212', padding: '0.75rem 0.85rem', marginBottom: '1rem', boxShadow: '2px 2px 0px #121212' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#121212', fontStyle: tip.message ? 'normal' : 'italic' }}>
                        "{tip.message || 'Direct tip for city transit support'}"
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Timestamp & Verified Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', borderTop: '2px solid #121212', paddingTop: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      {tip.timeAgo || 'Just now'}
                    </span>

                    {tip.transactionHash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tip.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#008000', textDecoration: 'underline' }}
                        title="View verified log transaction on Sepolia Etherscan"
                      >
                        <UserCheck size={13} /> On-Chain Log <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#008000' }}>
                        <UserCheck size={13} /> On-Chain Verified
                      </span>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </section>
  );
}
