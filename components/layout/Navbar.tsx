"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { ProfileDropdown } from "./ProfileDropdown";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      {/* Hamburger */}
      <button
        className="navbar__hamburger"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        id="navbar-menu-btn"
      >
        <span className="navbar__hamburger-line" />
        <span className="navbar__hamburger-line" />
        <span
          className="navbar__hamburger-line"
          style={{ width: "12px", alignSelf: "flex-start" }}
        />
      </button>

      {/* Logo */}
      <Link href="/rate" className="navbar__logo" id="navbar-logo">
        <div className="navbar__logo-icon">⭐</div>
        <span className="navbar__logo-text">StarRate</span>
      </Link>

      {/* Actions */}
      <div className="navbar__actions">
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            className="profile-avatar-btn"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            id="navbar-profile-btn"
          >
            {initials}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <ProfileDropdown onClose={() => setProfileOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
