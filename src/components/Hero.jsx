import React from 'react';
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onTipClick }) {
  return (
    <section id="hero" style={{ position: 'relative', padding: '3.5rem 1.5rem 2.5rem', overflow: 'hidden', borderBottom: '3px solid #121212' }}>
      
      {/* Decorative Crosshairs & Starbursts */}
      <div style={{ position: 'absolute', top: '15px', left: '25px' }} className="plus-crosshair">+</div>
      <div style={{ position: 'absolute', top: '15px', right: '45px' }} className="starburst">*</div>
      <div style={{ position: 'absolute', bottom: '20px', left: '15px' }} className="plus-crosshair">+</div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'center' }}>
        
        {/* Main Left Headline Block */}
        <div style={{ gridColumn: 'span 7' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="brutal-badge brutal-card-coral">ZERO PLATFORM CUTS</span>
            <span className="brutal-badge brutal-card-teal">PEER-TO-PEER WEBP3</span>
            <span className="handwritten" style={{ fontSize: '1.1rem', background: '#FFD05B', padding: '0.1rem 0.6rem', border: '2px solid #121212' }}>
              Ifeoma's City Transit Wall
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', lineHeight: 1.05, marginBottom: '1.5rem' }}>
            9,000 COMMUTERS NEED THIS TIMETABLE.
          </h1>

          {/* Yellow Highlighted Box (Matching "IT HAS AN EXAM SYSTEM" in user screenshot) */}
          <div className="brutal-card brutal-card-yellow" style={{ padding: '1rem 1.5rem', marginBottom: '1.75rem', transform: 'rotate(-0.5deg)' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', lineHeight: 1.1, color: '#121212' }}>
              IFEOMA KEEPS IT ALIVE OUT OF POCKET.
            </h2>
          </div>

          <p style={{ fontSize: '1.15rem', fontWeight: 600, maxWidth: '620px', color: '#2A2A2A', marginBottom: '2rem' }}>
            For 3 years, transit authority PDFs went stale without warning. Nine thousand daily commuters rely on Ifeoma's site before leaving the house. Connect your wallet, send a micro-tip, and put your name on the live supporter wall with <strong>0% middleman fees</strong>.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={onTipClick} className="brutal-btn brutal-btn-yellow" style={{ fontSize: '1.1rem', padding: '0.9rem 2rem', borderRadius: '50px' }}>
              <span>Send Tip & Join Wall</span>
              <ArrowRight size={20} />
            </button>

            <a href="#supporter-wall" className="handwritten" style={{ fontSize: '1.2rem', color: '#121212', textDecoration: 'underline', fontWeight: 'bold' }}>
              View 24 Live Supporters 👇
            </a>
          </div>

        </div>

        {/* Right Graphic Collage (Matching blue sticky note & dashed node trajectory from screenshot) */}
        <div style={{ gridColumn: 'span 5', position: 'relative' }}>
          
          {/* Dashed Trajectory Line Background */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <path 
              d="M 20 40 H 280 V 160 H 120 V 280 H 300" 
              fill="none" 
              stroke="#121212" 
              strokeWidth="3" 
              className="dashed-path"
            />
          </svg>

          {/* Floating Blue Sticky Note (Matching "Lakhs to a coaching institute" note in screenshot) */}
          <div className="brutal-card brutal-card-blue tilt-left" style={{ padding: '1.5rem', marginBottom: '2.5rem', position: 'relative', zIndex: 2 }}>
            <div className="tape-strip"></div>
            <p style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} /> Why Web3 Tipping?
            </p>
            <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Traditional tip platforms charge heavy cuts, demand confusing tax paperwork, or block international creators. Praise Board sends ETH straight to Ifeoma's wallet address instantly!
            </p>
          </div>

          {/* Node Trajectory Badges (Matching '18' & '22' circular nodes in screenshot) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="brutal-badge brutal-card-coral" style={{ borderRadius: '50%', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, flexShrink: 0 }}>
                3Y
              </div>
              <div className="brutal-card" style={{ padding: '0.6rem 1rem', background: '#FFFFFF', flexGrow: 1 }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>3 Years Out-Of-Pocket Hosting</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="brutal-badge brutal-card-yellow" style={{ borderRadius: '50%', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, flexShrink: 0 }}>
                9K
              </div>
              <div className="brutal-card" style={{ padding: '0.6rem 1rem', background: '#FFFFFF', flexGrow: 1 }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Daily Active Commuters Rely On It</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="brutal-badge brutal-card-teal" style={{ borderRadius: '50%', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, flexShrink: 0 }}>
                0%
              </div>
              <div className="brutal-card" style={{ padding: '0.6rem 1rem', background: '#FFFFFF', flexGrow: 1 }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Middleman & Platform Fee Cut</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
