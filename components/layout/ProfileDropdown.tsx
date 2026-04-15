"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "motion/react";
import Link from "next/link";

interface ProfileDropdownProps {
  onClose: () => void;
}

const springConfig = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.8,
};

export function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <motion.div
      className="profile-dropdown"
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={springConfig}
      style={{ transformOrigin: "top right" }}
      id="profile-dropdown"
    >
      {/* Header */}
      <div className="profile-dropdown__header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Mini avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--aurora-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-heading)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <div className="profile-dropdown__name">
              {session?.user?.name || "User"}
            </div>
            <div className="profile-dropdown__email">
              {session?.user?.email || ""}
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <Link
        className="profile-dropdown__item"
        onClick={onClose}
        href="/profile"
        id="profile-dropdown-profile-btn"
      >
        <span>👤</span>
        <span>Your Profile</span>
      </Link>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(102,126,234,0.15), transparent)",
          margin: "4px 12px",
        }}
      />

      <button
        className="profile-dropdown__item danger"
        onClick={() => {
          onClose();
          signOut({ callbackUrl: "/login" });
        }}
        id="profile-dropdown-logout-btn"
      >
        <span>🚪</span>
        <span>Sign Out</span>
      </button>
    </motion.div>
  );
}
