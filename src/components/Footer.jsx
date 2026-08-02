import React from 'react';
import { Heart, Github, Bus, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#121212', color: '#FFFFFF', padding: '3rem 1.5rem', borderTop: '3px solid #121212' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="brutal-badge brutal-card-yellow" style={{ fontSize: '1.2rem', padding: '0.4rem 0.8rem', color: '#121212', marginBottom: '0.75rem' }}>
              🚌 THE PRAISE BOARD
            </div>
            <p style={{ color: '#E0E0E0', maxWidth: '480px', fontSize: '0.95rem', fontWeight: 600 }}>
              Supporting community heroes and independent infrastructure maintainers with direct web3 tipping.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="brutal-badge brutal-card-teal" style={{ color: '#121212' }}>Contest Entry: Loops House</span>
            <span className="brutal-badge brutal-card-purple" style={{ color: '#121212' }}>Zero to One Series</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#A0A0A0' }}>
          <div>
            © 2026 The Praise Board — Built for Ifeoma's City Transit Timetables.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#FFD05B', fontWeight: 700 }}>
            <Heart size={14} fill="#FFD05B" /> Zero Middleman Fees. 100% On-Chain.
          </div>
        </div>

      </div>
    </footer>
  );
}
