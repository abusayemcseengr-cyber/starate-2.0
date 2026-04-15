"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export interface Celebrity {
  id: string;
  name: string;
  photo: string;
  bio: string;
  category: string;
  nationality: string | null;
  avgRating: number;
  totalVotes: number;
}

interface CelebrityCardProps {
  celebrity: Celebrity;
}

const SPRING = { stiffness: 300, damping: 20, mass: 1 };

const CATEGORY_EMOJI: Record<string, string> = {
  Actor: "🎬", Actress: "🎭", Musician: "🎵",
  Athlete: "⚽", Model: "👗", Director: "🎥",
  Comedian: "😄", Presenter: "📺",
};

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
  "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)",
  "linear-gradient(135deg,#fda085 0%,#f6d365 100%)",
  "linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)",
  "linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)",
  "linear-gradient(135deg,#fa709a 0%,#fee140 100%)",
  "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)",
];

function getGradient(name: string) {
  return PLACEHOLDER_GRADIENTS[name.charCodeAt(0) % PLACEHOLDER_GRADIENTS.length];
}
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function getCategoryEmoji(cat: string) {
  return CATEGORY_EMOJI[cat] ?? "⭐";
}

export function CelebrityCard({ celebrity }: CelebrityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), SPRING);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), SPRING);
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ["0%",  "100%"]);
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ["0%",  "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  };

  const hasPhoto = Boolean(celebrity.photo);

  return (
    <div style={{ perspective: "var(--perspective-card)", width: "100%", maxWidth: 400 }}>
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          borderRadius: "var(--radius-xl)",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1.5px solid rgba(255,255,255,0.55)",
          boxShadow: hovered
            ? "0 32px 80px rgba(102,126,234,0.28), 0 8px 24px rgba(0,0,0,0.08)"
            : "0 16px 48px rgba(102,126,234,0.18), 0 4px 12px rgba(0,0,0,0.04)",
          overflow: "hidden",
          cursor: "default",
          userSelect: "none",
          transition: "box-shadow 0.3s ease",
        }}
        whileHover={{ scale: 1.018 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setHovered(true)}
      >
        {/* ── Photo Area ── */}
        <div
          style={{
            position: "relative",
            height: 340,
            overflow: "hidden",
            background: hasPhoto ? "transparent" : getGradient(celebrity.name),
          }}
        >
          {hasPhoto ? (
            <Image
              src={celebrity.photo}
              alt={celebrity.name}
              fill
              sizes="400px"
              unoptimized
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            /* Placeholder — gradient + initials */
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span style={{ fontSize: "5.5rem", filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.25))" }}>
                {getCategoryEmoji(celebrity.category)}
              </span>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.92)",
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                  letterSpacing: "-0.03em",
                }}
              >
                {getInitials(celebrity.name)}
              </div>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
              background: "linear-gradient(to top, rgba(10,8,30,0.75) 0%, transparent 100%)",
            }}
          />

          {/* Dynamic specular shine — follows mouse */}
          {hovered && (
            <motion.div
              style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.10) 0%, transparent 60%)`,
              }}
            />
          )}

          {/* Category badge */}
          <div
            style={{
              position: "absolute", top: 16, left: 16,
              padding: "5px 13px",
              borderRadius: "var(--radius-pill)",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.30)",
              color: "white",
              fontSize: "0.70rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {getCategoryEmoji(celebrity.category)} {celebrity.category}
          </div>

          {/* Name overlay */}
          <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.65rem",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                textShadow: "0 2px 16px rgba(0,0,0,0.35)",
                letterSpacing: "-0.025em",
              }}
            >
              {celebrity.name}
            </div>
            {celebrity.nationality && (
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.78)", marginTop: 4 }}>
                📍 {celebrity.nationality}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderTop: "1px solid rgba(102,126,234,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>⭐</span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.05rem",
                background: "var(--aurora-gradient)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {celebrity.avgRating > 0 ? celebrity.avgRating.toFixed(1) : "—"}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>avg</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {celebrity.totalVotes > 0
              ? `${celebrity.totalVotes.toLocaleString()} votes`
              : "No ratings yet"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
