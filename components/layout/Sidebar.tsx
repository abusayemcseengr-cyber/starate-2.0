"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/rate",       icon: "🏠", label: "Rate" },
  { href: "/rankings",   icon: "📊", label: "Rankings" },
  { href: "/collection", icon: "📁", label: "Collection" },
  { href: "/qa",         icon: "❓", label: "Q&A" },
  { href: "/about",      icon: "ℹ️",  label: "About Us" },
];

const springConfig = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const firstItemRef = useRef<HTMLAnchorElement>(null);

  // Focus trap: focus first nav item on open
  useEffect(() => {
    if (open) {
      setTimeout(() => firstItemRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            className="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={springConfig}
            aria-label="Site navigation"
            role="dialog"
          >
            {/* Header */}
            <div className="sidebar__header">
              <Link href="/rate" className="sidebar__logo" onClick={onClose} id="sidebar-logo">
                <div className="navbar__logo-icon">⭐</div>
                <span className="navbar__logo-text">StarRate</span>
              </Link>
              <button
                className="sidebar__close"
                onClick={onClose}
                aria-label="Close menu"
                id="sidebar-close-btn"
              >
                ✕
              </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav" role="navigation">
              <span className="sidebar__nav-label">Navigate</span>

              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + idx * 0.04, ...springConfig }}
                  >
                    <Link
                      href={item.href}
                      ref={idx === 0 ? firstItemRef : undefined}
                      onClick={onClose}
                      className={`sidebar__nav-item${isActive ? " active" : ""}`}
                      id={`sidebar-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="sidebar__nav-icon">{item.icon}</span>
                      <span className="sidebar__nav-text">{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          style={{
                            position: "absolute",
                            right: "12px",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.8)",
                            zIndex: 2,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="sidebar__divider" style={{ marginTop: "auto" }} />
            </nav>

            {/* Footer */}
            <div className="sidebar__footer">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, ...springConfig }}
              >
                <button
                  className="sidebar__nav-item"
                  onClick={() => { signOut({ callbackUrl: "/login" }); onClose(); }}
                  id="sidebar-logout-btn"
                  style={{ color: "#f5576c" }}
                >
                  <span className="sidebar__nav-icon">🚪</span>
                  <span className="sidebar__nav-text">Logout</span>
                </button>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
