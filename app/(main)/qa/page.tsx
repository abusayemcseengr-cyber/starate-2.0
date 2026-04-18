'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';

const faqs = [
  {
    q: 'How does the rating system work?',
    a: "You'll be shown a celebrity card one at a time. Select a score from 0–10 using the circular rating buttons, then submit. The card animates out and a new celebrity springs in. Your ratings are saved to your private collection.",
  },
  {
    q: 'Can I change my rating after submitting?',
    a: "Yes! Visit your Collection page to see every celebrity you've rated. You can update your score at any time — your rating will be re-averaged into the global leaderboard immediately.",
  },
  {
    q: 'What data is collected about me?',
    a: 'We store only your name, email, and your ratings. Your password is securely hashed and never stored in plain text. No payment info, no tracking pixels, no third-party analytics. Your data is yours.',
  },
  {
    q: 'How is the global average calculated?',
    a: "Each celebrity's average is the sum of all user scores divided by total votes. The Rankings page shows the top 50 celebrities sorted by average rating descending.",
  },
  {
    q: 'Can I submit a celebrity to be added?',
    a: 'Celebrity submissions are coming in a future update. For now, the platform features a curated collection of Bangladeshi and international celebrities across Film, Music, Sport and TV.',
  },
  {
    q: 'Is StarRate affiliated with any celebrity or agency?',
    a: 'No. StarRate is an independent fan platform. All celebrity information is publicly available and used for entertainment purposes only.',
  },
];

export default function QAPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        padding: 'var(--space-2xl) var(--space-lg)',
        maxWidth: 740,
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.2rem',
            fontWeight: 900,
            background: 'var(--aurora-gradient)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 'var(--space-xs)',
          }}
        >
          ❓ Questions & Answers
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Everything you need to know about StarRate.
        </p>
      </div>

      {/* Accordion */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}
      >
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <GlassPanel
              key={idx}
              radius="lg"
              glow={isOpen}
              glowColor="rgba(102,126,234,0.12)"
              style={{
                overflow: 'hidden',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* Question row */}
              <button
                id={`faq-btn-${idx}`}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-lg)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: 'var(--space-md)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.97rem',
                    color: isOpen
                      ? 'var(--aurora-indigo)'
                      : 'var(--text-primary)',
                    transition: 'color 0.2s ease',
                    flex: 1,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isOpen
                      ? 'var(--aurora-gradient)'
                      : 'rgba(102,126,234,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    color: isOpen ? 'white' : 'var(--aurora-indigo)',
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: 'all 0.25s var(--spring-gentle)',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                  }}
                >
                  +
                </span>
              </button>

              {/* Answer */}
              <div
                style={{
                  maxHeight: isOpen ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.35s var(--ease-out-expo)',
                }}
              >
                <p
                  style={{
                    padding: '0 var(--space-lg) var(--space-lg)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
