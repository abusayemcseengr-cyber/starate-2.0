import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatsGrid } from "@/components/about/StatsGrid";

const teamMembers = [
  { name: "Aurora Team",  role: "Platform Design",      emoji: "🎨" },
  { name: "Data Engine",  role: "Rankings & Analytics", emoji: "📊" },
  { name: "Auth Guard",   role: "Security & Privacy",   emoji: "🔒" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "calc(100vh - var(--navbar-height))", padding: "var(--space-2xl) var(--space-lg)", maxWidth: 860, margin: "0 auto" }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-3xl)", padding: "var(--space-3xl) 0" }}>
        <div style={{ fontSize: "4rem", marginBottom: "var(--space-md)" }}>⭐</div>
        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(2rem,5vw,3.2rem)",
          fontWeight: 900,
          background: "var(--aurora-gradient)",
          backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1.1, marginBottom: "var(--space-lg)",
        }}>
          About StarRate
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          StarRate is a beautiful, interactive celebrity ranking platform where your
          opinion shapes the global leaderboard. Rate, discover, and compare the stars
          you love — all in a stunning Aurora Glass experience.
        </p>
      </div>

      {/* ── Live Stats (client component) ── */}
      <StatsGrid />

      {/* ── Mission ── */}
      <GlassPanel radius="xl" glow glowColor="rgba(102,126,234,0.14)" padding="var(--space-2xl)" style={{ marginBottom: "var(--space-2xl)" }}>
        <h2 style={{
          fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800,
          color: "var(--text-primary)", marginBottom: "var(--space-md)",
        }}>🎯 Our Mission</h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.95rem" }}>
          Celebrity culture is everywhere — but the conversation is scattered across
          social media with no central place to meaningfully rank and compare. StarRate
          brings that experience into a single, beautifully designed platform.
          <br /><br />
          We believe in transparency, privacy, and great design. No algorithms
          manipulating what you see. No ads. Just pure, honest ratings from real fans.
        </p>
      </GlassPanel>

      {/* ── Team ── */}
      <h2 style={{
        fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 800,
        color: "var(--text-primary)", marginBottom: "var(--space-lg)",
      }}>👥 Built by</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
        {teamMembers.map((m) => (
          <GlassPanel key={m.name} radius="lg" padding="var(--space-lg)" style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--aurora-gradient)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.6rem", flexShrink: 0,
            }}>{m.emoji}</div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{m.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{m.role}</div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* ── Tech Stack ── */}
      <GlassPanel radius="xl" padding="var(--space-xl)">
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "var(--space-md)" }}>
          🛠 Built With
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
          {["Next.js 14", "TypeScript", "Motion v12", "Auth.js v5", "Prisma 5", "SQLite", "Aurora Glass CSS"].map((tech) => (
            <span key={tech} style={{
              padding: "5px 14px", borderRadius: "var(--radius-pill)",
              background: "rgba(102,126,234,0.08)", border: "1px solid rgba(102,126,234,0.15)",
              color: "var(--aurora-indigo)", fontSize: "0.80rem", fontWeight: 600,
            }}>{tech}</span>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
