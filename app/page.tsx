import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="landing-page" style={{ 
      minHeight: "100vh", 
      background: "var(--aurora-base)",
      overflow: "hidden",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Background Blobs */}
      <div style={{ position: "absolute", top: -100, left: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(102,126,234,0.15), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 600, height: 600, background: "radial-gradient(circle, rgba(240,147,251,0.15), transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />

      {/* Hero Section */}
      <main style={{ 
        position: "relative", 
        zIndex: 1, 
        maxWidth: 1200, 
        width: "100%", 
        padding: "120px 24px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}>
        <div style={{
          padding: "6px 16px",
          borderRadius: "var(--radius-pill)",
          background: "rgba(102,126,234,0.08)",
          border: "1px solid rgba(102,126,234,0.15)",
          color: "var(--aurora-indigo)",
          fontSize: "0.85rem",
          fontWeight: 700,
          marginBottom: "var(--space-lg)",
          letterSpacing: "0.05em",
          textTransform: "uppercase"
        }}>
          ✨ Discover Global Rankings
        </div>

        <h1 style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(3rem, 8vw, 5.5rem)",
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          marginBottom: "var(--space-lg)",
          background: "var(--aurora-gradient)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Rate the Stars <br/> in Aurora Glass.
        </h1>

        <p style={{
          maxWidth: 600,
          fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          marginBottom: "var(--space-2xl)"
        }}>
          Join the world&apos;s most beautiful celebrity ranking platform. 
          Discover, rate, and track your favorite stars with stunning glass aesthetics.
        </p>

        <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", justifyContent: "center" }}>
          {session ? (
            <Link href="/rate" style={{
              padding: "16px 40px",
              borderRadius: "var(--radius-md)",
              background: "var(--aurora-gradient)",
              color: "white",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "1.1rem",
              textDecoration: "none",
              boxShadow: "0 10px 40px rgba(102,126,234,0.4)"
            }}>
              Go to App →
            </Link>
          ) : (
            <>
              <Link href="/register" style={{
                padding: "16px 40px",
                borderRadius: "var(--radius-md)",
                background: "var(--aurora-gradient)",
                color: "white",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.1rem",
                textDecoration: "none",
                boxShadow: "0 10px 40px rgba(102,126,234,0.4)"
              }}>
                Get Started
              </Link>
              <Link href="/login" style={{
                padding: "16px 40px",
                borderRadius: "var(--radius-md)",
                background: "white",
                color: "var(--text-primary)",
                border: "1px solid rgba(0,0,0,0.1)",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "1.1rem",
                textDecoration: "none"
              }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Stats Section / Preview */}
      <footer style={{ 
        marginTop: "auto", 
        width: "100%", 
        padding: "60px 24px",
        background: "rgba(255,255,255,0.4)",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        textAlign: "center"
      }}>
         <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 4, fontFamily: "var(--font-heading)" }}>2.5k+</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>Ratings Submitted</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 4, fontFamily: "var(--font-heading)" }}>200+</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>Active Stars</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 4, fontFamily: "var(--font-heading)" }}>100%</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 600 }}>Community Driven</div>
            </div>
         </div>
      </footer>
    </div>
  );
}
