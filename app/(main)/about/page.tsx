'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatsGrid } from '@/components/about/StatsGrid';
import { Sparkles, Layout } from 'lucide-react';

// Team Members Mapping
const teamMembers = [
  {
    name: 'Sabirul Islam Kawser',
    role: 'Project Engineering',
    info: 'Focused on creating fluid CSS animations and responsive layouts.',
    image:
      'https://i.postimg.cc/MZsZKXvc/484090787-2059821037865134-3386856517630383315-n.jpg',
  },
  {
    name: 'Bijoy Sarker',
    role: 'Project Engineering',
    info: 'Managing database integrity and high-performance API endpoints.',
    image:
      'https://i.postimg.cc/5yGM5YCS/612922314-899779046347373-424048666164197175-n.jpg',
  },
  {
    name: 'Gourab Saha',
    role: 'Project Engineering',
    info: 'Ensures the StarRate experience is intuitive and visually stunning.',
    image:
      'https://i.postimg.cc/RqrDVcty/558906089-2057379381755943-7716747751140515589-n.jpg',
  },
  {
    name: 'Mehedi Hasan Rokon',
    role: 'Project Engineering',
    info: 'Rigorous testing to maintain platform stability and performance.',
    image:
      'https://i.postimg.cc/c4yWJY02/613800580-2235368270323279-288178105462231878-n.jpg',
  },
];

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as any },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 'var(--space-3xl) var(--space-lg)',
        maxWidth: 1200,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <style>{`
        .responsive-teacher-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xl);
          text-align: center;
        }
        @media (min-width: 768px) {
          .responsive-teacher-panel {
            flex-direction: row;
            text-align: left;
          }
        }
        .leader-flex {
          display: flex;
          flex-wrap: wrap;
        }
        .leader-image-side {
          flex: 1 1 250px;
          position: relative;
          min-height: 280px;
          background: var(--aurora-gradient);
        }
        .leader-content-side {
          flex: 1 1 400px;
          padding: var(--space-2xl);
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }
      `}</style>

      {/* ── Background Decoration ── */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background:
            'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 900,
              background: 'var(--aurora-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              marginBottom: 'var(--space-md)',
            }}
          >
            About StarRate
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            A university group project from the CSE Department, Daffodil
            International University — a modern celebrity rating platform built
            with Next.js, Prisma, and PostgreSQL.
          </p>
        </motion.div>
      </div>

      <StatsGrid />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2xl)',
        }}
      >
        {/* Tier 1: Course Teacher */}
        <motion.div variants={itemVariants}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--aurora-indigo)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-md)',
              }}
            >
              Project Supervisor
            </h2>
            <GlassPanel
              radius="2xl"
              glow
              padding="var(--space-2xl)"
              style={{
                maxWidth: 900,
                margin: '0 auto',
                border: '1.5px solid rgba(255,255,255,0.6)',
              }}
            >
              <div className="responsive-teacher-panel">
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: '24%',
                    background: 'rgba(0,0,0,0.03)',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="https://i.postimg.cc/tJBKq1k0/f3.png"
                    alt="Md Akhtaruzzaman"
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2rem',
                      fontWeight: 900,
                      marginBottom: 4,
                    }}
                  >
                    Md Akhtaruzzaman
                  </h3>
                  <p
                    style={{
                      color: 'var(--aurora-indigo)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                    }}
                  >
                    Course Teacher & Supervisor
                  </p>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    Department of CSE, Daffodil International University
                  </p>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.8,
                      maxWidth: 650,
                    }}
                  >
                    Providing strategic guidance and academic oversight, our
                    faculty supervisor ensures that the project maintains the
                    highest standards of technical excellence and innovative
                    design.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        {/* Tier 2: Project Leader (Abu Sayem) */}
        <motion.div variants={itemVariants}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--aurora-purple)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-md)',
              }}
            >
              Technical Architect
            </h2>
            <GlassPanel
              radius="2xl"
              style={{
                maxWidth: 900,
                margin: '0 auto',
                overflow: 'hidden',
                background: 'rgba(102, 126, 234, 0.04)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
              }}
            >
              <div className="leader-flex">
                <div
                  className="leader-image-side"
                  style={{ overflow: 'hidden', borderRadius: '14px 0 0 14px' }}
                >
                  <Image
                    src="https://i.postimg.cc/gkPX8xG2/IMG-0490.avif"
                    alt="Abu Sayem"
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        zIndex: 1,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          marginBottom: 0,
                        }}
                      >
                        ABU SAYEM
                      </h4>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          opacity: 0.8,
                        }}
                      >
                        FOUNDER & LEAD DEVELOPER
                      </p>
                    </div>
                  </div>
                </div>
                <div className="leader-content-side">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                      marginBottom: 'var(--space-lg)',
                    }}
                  >
                    <Layout size={24} color="var(--aurora-indigo)" />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.75rem',
                      fontWeight: 900,
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    Full Stack Development Lead
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      lineHeight: 1.8,
                      fontSize: '1.05rem',
                    }}
                  >
                    I am Abu Sayem, from Section 65_H, the lead visionary and
                    full-stack architect behind StarRate. My mission was to
                    merge complex data structures with a premium, motion-driven
                    user interface. I engineered the core authentication,
                    database schemas, and the unique aurora-glass design system
                    used throughout this platform.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      marginTop: 'var(--space-xl)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      NEXT.JS 14
                    </span>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      TYPESCRIPT
                    </span>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: 10,
                        background: 'rgba(0,0,0,0.05)',
                      }}
                    >
                      PRISMA
                    </span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        {/* Tier 3: Other 4 team members */}
        <motion.div variants={itemVariants}>
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-xl)',
              }}
            >
              Project Engineering Team
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-lg)',
              }}
            >
              {teamMembers.map((member, i) => (
                <GlassPanel
                  key={i}
                  radius="xl"
                  padding="var(--space-2xl) var(--space-xl)"
                  style={{ textAlign: 'center' }}
                >
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.04)',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '4px solid white',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      margin: '0 auto var(--space-lg)',
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h4
                    style={{
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      marginBottom: 4,
                    }}
                  >
                    {member.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--aurora-indigo)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    {member.info}
                  </p>
                </GlassPanel>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tier 4: Tech Stack */}
        <motion.div variants={itemVariants}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'var(--space-2xl)',
              marginTop: 'var(--space-2xl)',
            }}
          >
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: 'var(--aurora-indigo)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-md)',
              }}
            >
              Platform Architecture
            </h2>
            <GlassPanel
              radius="2xl"
              padding="var(--space-2xl)"
              style={{ maxWidth: 900, margin: '0 auto' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: 'var(--space-md)',
                }}
              >
                {[
                  'Next.js 14',
                  'React 18',
                  'TypeScript',
                  'PostgreSQL',
                  'Prisma ORM',
                  'Auth.js v5',
                  'Framer Motion',
                  'Lucide Icons',
                  'Aurora Glass UI',
                ].map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '100px',
                      background: 'rgba(102,126,234,0.08)',
                      border: '1px solid rgba(102,126,234,0.15)',
                      color: 'var(--aurora-indigo)',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        {/* ── Final Footer Callout ── */}
        <motion.div
          variants={itemVariants}
          style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}
        >
          <GlassPanel
            radius="2xl"
            padding="var(--space-md) var(--space-xl)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(102, 126, 234, 0.15)',
            }}
          >
            <Sparkles size={18} color="var(--aurora-indigo)" />
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
              }}
            >
              🎓 CSE — Daffodil International University · 2026
            </span>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  );
}
