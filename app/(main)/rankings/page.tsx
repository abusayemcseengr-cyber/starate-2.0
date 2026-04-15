"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface RankedCeleb {
  id: string;
  name: string;
  photo: string;
  category: string;
  nationality: string | null;
  avgRating: number;
  totalVotes: number;
}

interface RankingsData {
  ranked: RankedCeleb[];
  unranked: RankedCeleb[];
}

const MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const MEDAL_GLOW: Record<number, string> = {
  1: "rgba(246,211,101,0.18)",
  2: "rgba(192,192,192,0.18)",
  3: "rgba(205,127,50,0.18)",
};

function scoreBar(avg: number) {
  const pct = (avg / 10) * 100;
  const color =
    avg >= 8 ? "var(--aurora-gradient)" :
    avg >= 6 ? "linear-gradient(90deg,#f093fb,#f5576c)" :
               "linear-gradient(90deg,#fda085,#f6d365)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <div
        style={{
          flex: 1, height: 5, borderRadius: "var(--radius-pill)",
          background: "rgba(102,126,234,0.12)", overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          style={{ height: "100%", background: color, borderRadius: "var(--radius-pill)" }}
        />
      </div>
      <span style={{
        fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem",
        background: color, backgroundClip: "text", WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent", minWidth: 34, textAlign: "right",
      }}>
        {avg.toFixed(1)}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <GlassPanel radius="xl" glow padding="var(--space-lg)">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{
          height: 52, borderRadius: "var(--radius-md)", marginBottom: 6,
          background: "linear-gradient(90deg,rgba(102,126,234,0.06) 25%,rgba(102,126,234,0.12) 50%,rgba(102,126,234,0.06) 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.07}s`,
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </GlassPanel>
  );
}

export default function RankingsPage() {
  const [data, setData]       = useState<RankingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/rankings")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - var(--navbar-height))", padding: "var(--space-2xl) var(--space-lg)", maxWidth: 860, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{
          fontFamily: "var(--font-heading)", fontSize: "2.2rem", fontWeight: 900,
          background: "var(--aurora-gradient)", backgroundClip: "text",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "var(--space-xs)",
        }}>
          📊 Live Rankings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          {data
            ? `${data.ranked.length} celebrities ranked · updated in real time`
            : "Loading leaderboard…"}
        </p>
      </div>

      {/* Table */}
      {loading ? <Skeleton /> : !data ? (
        <GlassPanel radius="xl" padding="var(--space-2xl)" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Could not load rankings.</p>
        </GlassPanel>
      ) : (
        <GlassPanel radius="xl" glow padding="var(--space-lg)">
          {/* Column headers */}
          <div
            className="rankings-table-header"
            style={{
              display: "grid", gridTemplateColumns: "44px 1fr 110px 1fr 80px",
              padding: "0 var(--space-md) var(--space-md)",
              borderBottom: "1px solid rgba(102,126,234,0.10)", marginBottom: "var(--space-sm)",
            }}>
            {["#", "Celebrity", "Category", "Rating", "Votes"].map((h) => (
              <span key={h} style={{
                fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.10em", color: "var(--text-muted)",
              }}>{h}</span>
            ))}
          </div>

          {/* Ranked rows */}
          <AnimatePresence>
            {data.ranked.map((cel, idx) => {
              const rank = idx + 1;
              const medal = MEDAL[rank];
              return (
                <motion.div
                  key={cel.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.035, type: "spring", stiffness: 300, damping: 24 }}
                  className="rankings-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr 110px 1fr 80px",
                    alignItems: "center",
                    padding: "13px var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    background: rank <= 3 ? `rgba(102,126,234,0.04)` : "transparent",
                    boxShadow: MEDAL_GLOW[rank] ? `inset 0 0 0 1px ${MEDAL_GLOW[rank]}` : "none",
                    marginBottom: 4, cursor: "default",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(102,126,234,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = rank <= 3 ? "rgba(102,126,234,0.04)" : "transparent")}
                >
                  {/* Rank */}
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: medal ? "1.35rem" : "1rem", color: "var(--text-muted)" }}>
                    {medal ?? rank}
                  </span>

                  {/* Name + photo */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                      background: cel.photo ? "none" : "var(--aurora-gradient)",
                      overflow: "hidden", border: "1.5px solid rgba(102,126,234,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.72rem", color: "white",
                    }}>
                      {cel.photo
                        ? <Image src={cel.photo} alt={cel.name} width={34} height={34} unoptimized style={{ objectFit: "cover" }} />
                        : cel.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{
                      fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.92rem",
                      color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{cel.name}</span>
                  </div>

                  {/* Category */}
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: "var(--radius-pill)",
                    background: "rgba(102,126,234,0.10)", color: "var(--aurora-indigo)",
                    fontSize: "0.72rem", fontWeight: 600, whiteSpace: "nowrap",
                  }}>{cel.category}</span>

                  {/* Score bar */}
                  {scoreBar(cel.avgRating)}

                  {/* Votes */}
                  <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)", textAlign: "right" }}>
                    {cel.totalVotes.toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Unranked toggle */}
          {data.unranked.length > 0 && (
            <>
              <div style={{
                height: 1, margin: "var(--space-md) 0",
                background: "linear-gradient(90deg,transparent,rgba(102,126,234,0.15),transparent)",
              }} />
              <button
                onClick={() => setShowAll((v) => !v)}
                style={{
                  width: "100%", padding: "10px", border: "none", background: "transparent",
                  color: "var(--aurora-indigo)", fontFamily: "var(--font-heading)",
                  fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                }}
              >
                {showAll ? "▲ Hide" : `▼ Show ${data.unranked.length} unranked celebrities`}
              </button>
              <AnimatePresence>
                {showAll && data.unranked.map((cel) => (
                  <motion.div
                    key={cel.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{   opacity: 0, height: 0 }}
                    style={{
                      display: "grid", gridTemplateColumns: "44px 1fr 110px 1fr 80px",
                      alignItems: "center", padding: "10px var(--space-md)",
                      borderRadius: "var(--radius-md)", marginBottom: 2, opacity: 0.55,
                    }}
                  >
                    <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>—</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                        background: "rgba(102,126,234,0.12)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.68rem", color: "var(--aurora-indigo)",
                      }}>
                        {cel.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{cel.name}</span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{cel.category}</span>
                    <span style={{ fontSize: "0.80rem", color: "var(--text-muted)" }}>Not yet rated</span>
                    <span />
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </GlassPanel>
      )}
    </div>
  );
}
