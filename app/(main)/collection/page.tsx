"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface CollectionItem {
  ratingId:  string;
  score:     number;
  ratedAt:   string;
  celebrity: {
    id:         string;
    name:       string;
    photo:      string;
    category:   string;
    nationality: string | null;
    avgRating:  number;
    totalVotes: number;
  };
}

function scoreGradient(score: number): string {
  if (score >= 9) return "linear-gradient(135deg,#667eea,#764ba2)";
  if (score >= 7) return "linear-gradient(135deg,#f093fb,#f5576c)";
  if (score >= 5) return "linear-gradient(135deg,#fda085,#f6d365)";
  return "linear-gradient(135deg,#b8c1cc,#8899a6)";
}
function scoreLabel(s: number) {
  if (s === 10)   return "Masterpiece";
  if (s >= 9)     return "Amazing";
  if (s >= 7)     return "Great";
  if (s >= 5)     return "Decent";
  if (s >= 3)     return "Below avg";
  return          "Didn't like";
}

const PLACEHOLDERS = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#fda085,#f6d365)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
];

function Skeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))", gap: "var(--space-md)" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          height: 280, borderRadius: "var(--radius-lg)",
          background: "linear-gradient(90deg,rgba(102,126,234,0.06) 25%,rgba(102,126,234,0.12) 50%,rgba(102,126,234,0.06) 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

type SortKey = "ratedAt" | "score" | "name" | "avgRating";

export default function CollectionPage() {
  const [items,   setItems]   = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort,    setSort]    = useState<SortKey>("ratedAt");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/collection")
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...items].sort((a, b) => {
    if (sort === "ratedAt") return new Date(b.ratedAt).getTime() - new Date(a.ratedAt).getTime();
    if (sort === "score")   return b.score - a.score;
    if (sort === "name")    return a.celebrity.name.localeCompare(b.celebrity.name);
    if (sort === "avgRating") return b.celebrity.avgRating - a.celebrity.avgRating;
    return 0;
  });

  return (
    <div style={{ minHeight: "calc(100vh - var(--navbar-height))", padding: "var(--space-2xl) var(--space-lg)", maxWidth: 1020, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: "var(--space-xl)" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: "2.2rem", fontWeight: 900,
            background: "var(--aurora-gradient)", backgroundClip: "text",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "var(--space-xs)",
          }}>
            📁 Your Collection
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "celebrity" : "celebrities"} rated`}
          </p>
        </div>

        {/* Sort controls */}
        {!loading && items.length > 0 && (
          <div className="collection-sort-controls" style={{ display: "flex", gap: 6 }}>
            {(["ratedAt","score","name","avgRating"] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                style={{
                  padding: "5px 13px", borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer",
                  background: sort === key ? "var(--aurora-gradient)" : "rgba(102,126,234,0.08)",
                  color: sort === key ? "white" : "var(--aurora-indigo)",
                  fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.76rem",
                  transition: "all 0.2s ease",
                }}
              >
                {{ ratedAt: "Recent", score: "My Score", name: "A–Z", avgRating: "Avg" }[key]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? <Skeleton /> : items.length === 0 ? (
        <GlassPanel radius="xl" glow padding="var(--space-2xl)" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "var(--space-md)" }}>🎬</div>
          <h3 style={{
            fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.4rem",
            background: "var(--aurora-gradient)", backgroundClip: "text",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "var(--space-sm)",
          }}>
            Your collection is empty
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Head over to <b>Rate</b> to start building your collection!
          </p>
        </GlassPanel>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="collection-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))", gap: "var(--space-md)" }}>
            {sorted.map((item, idx) => {
              const cel   = item.celebrity;
              const grad  = PLACEHOLDERS[cel.name.charCodeAt(0) % PLACEHOLDERS.length];
              const isH   = hovered === item.ratingId;

              return (
                <motion.div
                  key={item.ratingId}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.94 }}
                  animate={{ opacity: 1, y:  0, scale: 1    }}
                  exit={{    opacity: 0, y: 12, scale: 0.94 }}
                  transition={{ delay: idx * 0.04, type: "spring", stiffness: 280, damping: 22 }}
                  onMouseEnter={() => setHovered(item.ratingId)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    transform: isH ? "translateY(-5px) scale(1.025)" : "none",
                    transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                    cursor: "default",
                  }}
                >
                  <GlassPanel radius="lg" glow={isH} glowColor="rgba(102,126,234,0.14)" style={{ overflow: "hidden" }}>
                    {/* Photo */}
                    <div style={{
                      height: 145, background: cel.photo ? "none" : grad,
                      display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
                    }}>
                      {cel.photo
                        ? <Image src={cel.photo} alt={cel.name} fill sizes="300px" unoptimized style={{ objectFit: "cover" }} />
                        : <span style={{
                            fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: "2.4rem",
                            color: "rgba(255,255,255,0.92)", textShadow: "0 2px 16px rgba(0,0,0,0.25)",
                          }}>
                            {cel.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>}
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
                      }} />
                    </div>

                    {/* Info */}
                    <div style={{ padding: "var(--space-md)" }}>
                      <div style={{
                        fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.89rem",
                        color: "var(--text-primary)", marginBottom: 3,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{cel.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
                        {cel.category}{cel.nationality ? ` · ${cel.nationality}` : ""}
                      </div>

                      {/* My score badge */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 10px", borderRadius: "var(--radius-pill)",
                          background: scoreGradient(item.score), color: "white",
                          fontSize: "0.76rem", fontWeight: 800, fontFamily: "var(--font-heading)",
                        }}>
                          ★ {item.score} · {scoreLabel(item.score)}
                        </div>
                      </div>

                      {/* Platform avg */}
                      {cel.avgRating > 0 && (
                        <div style={{ marginTop: 6, fontSize: "0.70rem", color: "var(--text-muted)" }}>
                          Global avg: ★ {cel.avgRating.toFixed(1)} ({cel.totalVotes.toLocaleString()} votes)
                        </div>
                      )}
                    </div>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
