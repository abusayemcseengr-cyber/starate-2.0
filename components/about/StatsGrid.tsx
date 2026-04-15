"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Stats {
  totalCelebrities: number;
  totalRatings:     number;
  totalUsers:       number;
  platformAvg:      number | null;
}

const statConfig = [
  { key: "totalCelebrities", label: "Celebrities", emoji: "🌟", suffix: "" },
  { key: "totalRatings",     label: "Votes Cast",  emoji: "🗳️",  suffix: "" },
  { key: "platformAvg",      label: "Avg Rating",  emoji: "⭐", suffix: "" },
  { key: "totalUsers",       label: "Users",       emoji: "👥", suffix: "" },
] as const;

function formatValue(key: string, val: number | null): string {
  if (val === null) return "—";
  if (key === "platformAvg") return val.toFixed(1);
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
}

export function StatsGrid() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
      gap: "var(--space-md)",
      marginBottom: "var(--space-3xl)",
    }}>
      {statConfig.map(({ key, label, emoji }, i) => {
        const raw = stats ? stats[key as keyof Stats] : null;
        const val = loading ? null : (raw as number | null);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y:  0, scale: 1    }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 280, damping: 22 }}
          >
            <GlassPanel radius="lg" glow glowColor="rgba(102,126,234,0.10)" padding="var(--space-lg)" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "var(--space-sm)" }}>{emoji}</div>
              <div style={{
                fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 900,
                background: "var(--aurora-gradient)", backgroundClip: "text",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                lineHeight: 1, marginBottom: 4, minHeight: 40,
              }}>
                {loading ? (
                  <span style={{
                    display: "inline-block", width: 60, height: 28,
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(102,126,234,0.10)",
                    animation: "pulse 1.2s ease-in-out infinite",
                  }} />
                ) : formatValue(key, val)}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{label}</div>
            </GlassPanel>
          </motion.div>
        );
      })}
      <style>{`@keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}`}</style>
    </div>
  );
}
