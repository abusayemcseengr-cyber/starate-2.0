import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function LandingPage() {
  const session = await auth();

  return (
    <div
      className="landing-page"
      style={{
        minHeight: '100vh',
        background: 'var(--aurora-base)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Background Blobs */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle, rgba(102,126,234,0.15), transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 600,
          height: 600,
          background:
            'radial-gradient(circle, rgba(240,147,251,0.15), transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Hero Section */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1200,
          width: '100%',
          padding: '120px 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            padding: '6px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'rgba(102,126,234,0.08)',
            border: '1px solid rgba(102,126,234,0.15)',
            color: 'var(--aurora-indigo)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: 'var(--space-lg)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          🌟 Bangladesh&apos;s Celebrity Rating Platform
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            marginBottom: 'var(--space-lg)',
            background: 'var(--aurora-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rate Bangladesh&apos;s <br /> Biggest Stars.
        </h1>

        <p
          style={{
            maxWidth: 600,
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 'var(--space-2xl)',
          }}
        >
          Join our community platform to discover, rate, and track your
          favourite Bangladeshi and international celebrities. Built by CSE
          students at Daffodil International University.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-md)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {session ? (
            <Link
              href="/rate"
              style={{
                padding: '16px 40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--aurora-gradient)',
                color: 'white',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.1rem',
                textDecoration: 'none',
                boxShadow: '0 10px 40px rgba(102,126,234,0.4)',
              }}
            >
              Go to App →
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                style={{
                  padding: '16px 40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--aurora-gradient)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  boxShadow: '0 10px 40px rgba(102,126,234,0.4)',
                }}
              >
                Get Started
              </Link>
              <Link
                href="/login"
                style={{
                  padding: '16px 40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'white',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Stats Section / Preview */}
      <footer
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '60px 24px',
          background: 'rgba(255,255,255,0.4)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>⭐</div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                marginBottom: 4,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Rate Celebrities
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              Score your favourite stars from 0–10, one card at a time.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📊</div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                marginBottom: 4,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Live Rankings
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              See the real-time leaderboard updated by community votes.
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📁</div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                marginBottom: 4,
                fontFamily: 'var(--font-heading)',
              }}
            >
              Your Collection
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              Track every celebrity you have rated in your personal profile.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
