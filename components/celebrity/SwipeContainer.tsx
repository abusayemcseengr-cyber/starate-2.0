"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CelebrityCard, type Celebrity } from "./CelebrityCard";
import { RatingRing } from "./RatingRing";

type Phase = "loading" | "showing" | "submitting" | "transitioning" | "empty";

const SPRING_ENTER  = { type: "spring" as const, stiffness: 300, damping: 22, mass: 0.9 };
const SPRING_EXIT   = { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.85 };

const cardVariants = {
  initial:    { y: 80,    scale: 0.88, opacity: 0,   rotate: 0   },
  animate:    { y: 0,     scale: 1,    opacity: 1,   rotate: 0   },
  exitLeft:   { x: "-115vw", scale: 0.9,  opacity: 0, rotate: -14, transition: SPRING_EXIT },
  exitRight:  { x:  "115vw", scale: 0.9,  opacity: 0, rotate:  14, transition: SPRING_EXIT },
};

const bioVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: {
      delay: delay * 0.08,
      type: "spring" as const,
      stiffness: 260,
      damping: 22,
    },
  }),
};

export function SwipeContainer() {
  const [phase,    setPhase]    = useState<Phase>("loading");
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [cardKey,  setCardKey]  = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [exitDir,  setExitDir]  = useState<"exitLeft" | "exitRight">("exitLeft");
  const [toast,    setToast]    = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const nextCelRef = useRef<Celebrity | null>(null);
  const submittingRef = useRef(false);

  /* ── Fetch a random (unrated) celebrity ── */
  const fetchCelebrity = useCallback(async (): Promise<Celebrity | null> => {
    try {
      const res = await fetch("/api/celebrities");
      if (res.status === 404) return null;
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    fetchCelebrity().then((cel) => {
      if (cel) { setCelebrity(cel); setPhase("showing"); }
      else      { setPhase("empty"); }
    });
  }, [fetchCelebrity]);

  /* ── Hide toast after 2.8 s ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Submit rating ── */
  const handleSubmit = useCallback(async () => {
    if (selected === null || !celebrity || phase !== "showing" || submittingRef.current) return;
    submittingRef.current = true;
    setPhase("submitting");

    try {
      const [ratingRes, next] = await Promise.all([
        fetch("/api/ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ celebrityId: celebrity.id, score: selected }),
        }),
        fetchCelebrity(),
      ]);

      if (!ratingRes.ok) throw new Error("Rating failed");
      nextCelRef.current = next;
      setToast({ msg: `★ ${selected}/10 submitted!`, type: "ok" });

    } catch {
      setToast({ msg: "Something went wrong — try again.", type: "err" });
      setPhase("showing");
      submittingRef.current = false;
      return;
    }

    /* Trigger exit animation */
    setExitDir(Math.random() > 0.5 ? "exitLeft" : "exitRight");
    setPhase("transitioning");
  }, [selected, celebrity, phase, fetchCelebrity]);

  /* ── Called when exit animation finishes ── */
  const handleExitComplete = useCallback(() => {
    const next = nextCelRef.current;
    nextCelRef.current = null;
    submittingRef.current = false;
    setSelected(null);

    if (next) {
      setCelebrity(next);
      setCardKey((k) => k + 1);
      setPhase("showing");
    } else {
      setPhase("empty");
    }
  }, []);

  const isSubmitting = phase === "submitting" || phase === "transitioning";

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-height))",
        padding: "var(--space-2xl) var(--space-lg)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,   scale: 1   }}
            exit={{    opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{
              position: "fixed",
              top: "calc(var(--navbar-height) + 12px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 500,
              padding: "10px 20px",
              borderRadius: "var(--radius-pill)",
              background: toast.type === "ok"
                ? "var(--aurora-gradient)"
                : "rgba(245,87,108,0.90)",
              color: "white",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "0.90rem",
              boxShadow: "0 8px 32px rgba(102,126,234,0.40)",
              backdropFilter: "blur(12px)",
              whiteSpace: "nowrap",
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main 2-column grid ── */}
      <div
        className="rate-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: "var(--space-2xl)",
          alignItems: "start",
          width: "100%",
          maxWidth: 900,
        }}
      >
        {/* ── LEFT — Card column ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            minHeight: 420,
          }}
        >
          {phase === "loading" && <CardSkeleton />}

          {phase === "empty" && <EmptyState />}

          <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
            {celebrity && phase !== "loading" && phase !== "empty" && phase !== "transitioning" && (
              <motion.div
                key={cardKey}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit={exitDir}
                transition={SPRING_ENTER}
                style={{ width: "100%", display: "flex", justifyContent: "center" }}
              >
                <CelebrityCard celebrity={celebrity} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT — Bio + Rating column ── */}
        <div>
          {celebrity && phase !== "loading" && phase !== "empty" ? (
            <>
              {/* Bio section */}
              <div style={{ marginBottom: "var(--space-xl)" }}>
                {/* Category chip */}
                <motion.div
                  key={`chip-${cardKey}`}
                  custom={0}
                  variants={bioVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: "inline-block",
                    padding: "4px 14px",
                    borderRadius: "var(--radius-pill)",
                    background: "rgba(102,126,234,0.10)",
                    border: "1px solid rgba(102,126,234,0.20)",
                    color: "var(--aurora-indigo)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  {celebrity.category} {celebrity.nationality ? `· ${celebrity.nationality}` : ""}
                </motion.div>

                {/* Name */}
                <motion.h2
                  key={`name-${cardKey}`}
                  custom={1}
                  variants={bioVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                    fontWeight: 900,
                    background: "var(--aurora-gradient)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.1,
                    marginBottom: "var(--space-md)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {celebrity.name}
                </motion.h2>

                {/* Bio */}
                <motion.p
                  key={`bio-${cardKey}`}
                  custom={2}
                  variants={bioVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                  }}
                >
                  {celebrity.bio}
                </motion.p>
              </div>

              {/* Divider */}
              <motion.div
                key={`divider-${cardKey}`}
                custom={3}
                variants={bioVariants}
                initial="hidden"
                animate="visible"
                style={{
                  height: 1,
                  background: "linear-gradient(90deg,transparent,rgba(102,126,234,0.20),transparent)",
                  marginBottom: "var(--space-xl)",
                }}
              />

              {/* Rating Ring */}
              <motion.div
                key={`ring-${cardKey}`}
                custom={4}
                variants={bioVariants}
                initial="hidden"
                animate="visible"
              >
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  marginBottom: "var(--space-md)",
                  letterSpacing: "-0.01em",
                }}>
                  How would you rate this star?
                </div>
                <RatingRing
                  selected={selected}
                  onSelect={setSelected}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  disabled={isSubmitting}
                />
              </motion.div>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile: stack on small screens via inline style media query fallback */}
      <style>{`
        @media (max-width: 680px) {
          .rate-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function CardSkeleton() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        height: 420,
        borderRadius: "var(--radius-xl)",
        background: "linear-gradient(90deg, rgba(102,126,234,0.06) 25%, rgba(102,126,234,0.12) 50%, rgba(102,126,234,0.06) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      style={{
        width: "100%",
        maxWidth: 400,
        padding: "var(--space-2xl)",
        borderRadius: "var(--radius-xl)",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255,255,255,0.50)",
        boxShadow: "0 8px 32px rgba(102,126,234,0.12)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "var(--space-md)" }}>🎉</div>
      <h3 style={{
        fontFamily: "var(--font-heading)",
        fontWeight: 800,
        fontSize: "1.4rem",
        background: "var(--aurora-gradient)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "var(--space-sm)",
      }}>
        You&apos;ve rated everyone!
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        Check your Collection to review and update your scores.
      </p>
    </motion.div>
  );
}
