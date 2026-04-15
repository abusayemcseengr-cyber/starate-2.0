"use client";

import { motion } from "motion/react";

interface RatingRingProps {
  selected: number | null;
  onSelect: (score: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

const SCORES = Array.from({ length: 11 }, (_, i) => i); // 0-10

const SPRING = { type: "spring" as const, stiffness: 500, damping: 18 };

function getScoreColor(score: number): string {
  if (score <= 3)  return "linear-gradient(135deg,#fda085,#f6d365)";
  if (score <= 6)  return "linear-gradient(135deg,#f093fb,#f5576c)";
  return           "linear-gradient(135deg,#667eea,#764ba2)";
}

function getScoreLabel(score: number): string {
  if (score === 0)  return "Did not like";
  if (score <= 3)   return "Mediocre";
  if (score <= 5)   return "Decent";
  if (score <= 7)   return "Great";
  if (score <= 9)   return "Amazing";
  return            "Perfection ✨";
}

function getScoreTone(score: number): string {
  if (score <= 3) return "Low";
  if (score <= 6) return "Mid";
  if (score <= 8) return "High";
  return "Top";
}

export function RatingRing({
  selected,
  onSelect,
  onSubmit,
  isSubmitting,
  disabled = false,
}: RatingRingProps) {
  return (
    <div>
      {/* Score helper / selected label */}
      <div
        style={{
          minHeight: 28,
          marginBottom: "var(--space-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {selected !== null ? (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={SPRING}
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "0.88rem",
              background: getScoreColor(selected),
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.01em",
            }}
          >
            {selected}/10 — {getScoreLabel(selected)} ({getScoreTone(selected)})
          </motion.div>
        ) : (
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.84rem",
              fontWeight: 600,
            }}
          >
            Select a score from 0 to 10
          </span>
        )}
      </div>

      {/* Scale hints */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "0 6px",
        }}
      >
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          0 = Poor
        </span>
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          10 = Excellent
        </span>
      </div>

      {/* Rating buttons — 0 to 10 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          marginBottom: "var(--space-xl)",
        }}
      >
        {SCORES.map((score) => {
          const isSelected = selected === score;
          return (
            <motion.button
              key={score}
              id={`rating-btn-${score}`}
              onClick={() => !disabled && onSelect(score)}
              aria-label={`Rate ${score} out of 10`}
              title={`Rate ${score} out of 10`}
              animate={isSelected ? { scale: 1.20 } : { scale: 1 }}
              whileHover={!disabled ? { scale: isSelected ? 1.22 : 1.12 } : {}}
              whileTap={!disabled ? { scale: 0.88 } : {}}
              transition={SPRING}
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: isSelected
                  ? "2.5px solid transparent"
                  : "2px solid rgba(102,126,234,0.20)",
                background: isSelected ? getScoreColor(score) : "rgba(255,255,255,0.60)",
                backdropFilter: "blur(8px)",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "1.02rem",
                color: isSelected ? "white" : "var(--text-secondary)",
                boxShadow: isSelected
                  ? `0 4px 20px rgba(102,126,234,0.40)`
                  : "0 2px 8px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.15s, color 0.15s",
              }}
            >
              {/* Pulse ring on selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: "2px solid rgba(102,126,234,0.45)",
                    pointerEvents: "none",
                  }}
                />
              )}
              {score}
            </motion.button>
          );
        })}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "-8px",
          marginBottom: "var(--space-lg)",
          color: "var(--text-muted)",
          fontSize: "0.78rem",
          fontWeight: 500,
        }}
      >
        Tip: you can change your score before submitting
      </div>

      {/* Submit */}
      <motion.button
        id="rating-submit-btn"
        onClick={selected !== null && !isSubmitting && !disabled ? onSubmit : undefined}
        whileHover={selected !== null && !isSubmitting ? { scale: 1.03, y: -2 } : {}}
        whileTap={selected !== null && !isSubmitting ? { scale: 0.97 } : {}}
        transition={SPRING}
        style={{
          width: "100%",
          padding: "14px 24px",
          borderRadius: "var(--radius-md)",
          border: "none",
          background: selected !== null
            ? "var(--aurora-gradient)"
            : "rgba(102,126,234,0.12)",
          backgroundSize: "200% 200%",
          color: selected !== null ? "white" : "var(--text-muted)",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "1.0rem",
          cursor: selected !== null && !isSubmitting ? "pointer" : "not-allowed",
          opacity: selected !== null ? 1 : 0.55,
          transition: "background 0.3s ease, color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: selected !== null
            ? "0 6px 24px rgba(102,126,234,0.40)"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {isSubmitting ? (
          <>
            <motion.span
              style={{
                width: 16, height: 16, borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.35)",
                borderTopColor: "white",
                display: "inline-block",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            />
            Submitting…
          </>
        ) : (
          <>
            {selected !== null ? "⭐" : "🔢"} Rate this Star
          </>
        )}
      </motion.button>
    </div>
  );
}
