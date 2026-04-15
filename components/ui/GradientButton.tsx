import React from "react";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "aurora" | "outline" | "ghost";
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: "8px 18px",  fontSize: "0.82rem", borderRadius: "var(--radius-sm)" },
  md: { padding: "11px 24px", fontSize: "0.93rem", borderRadius: "var(--radius-md)" },
  lg: { padding: "14px 32px", fontSize: "1.0rem",  borderRadius: "var(--radius-md)" },
};

export function GradientButton({
  children,
  onClick,
  type = "button",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = "aurora",
  id,
  className = "",
  style = {},
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    letterSpacing: "0.01em",
    border: "none",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.65 : 1,
    position: "relative",
    overflow: "hidden",
    transition:
      "transform 200ms var(--spring-gentle), box-shadow 200ms ease",
    width: fullWidth ? "100%" : "auto",
    ...sizeStyles[size],
    ...style,
  };

  if (variant === "aurora") {
    Object.assign(baseStyle, {
      background: "var(--aurora-gradient)",
      color: "#ffffff",
      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.40)",
    });
  } else if (variant === "outline") {
    Object.assign(baseStyle, {
      background: "transparent",
      color: "var(--aurora-indigo)",
      border: "2px solid var(--aurora-indigo)",
      boxShadow: "none",
    });
  } else if (variant === "ghost") {
    Object.assign(baseStyle, {
      background: "rgba(102, 126, 234, 0.07)",
      color: "var(--aurora-indigo)",
      boxShadow: "none",
    });
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    e.currentTarget.style.transform = "translateY(-2px)";
    if (variant === "aurora") {
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(102, 126, 234, 0.50)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "";
    if (variant === "aurora") {
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(102, 126, 234, 0.40)";
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    e.currentTarget.style.transform = "scale(0.97)";
  };

  return (
    <button
      type={type}
      id={id}
      className={`gradient-btn ${className}`}
      style={baseStyle}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseLeave}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.35)",
            borderTopColor: "white",
            display: "inline-block",
            animation: "spin 0.7s linear infinite",
          }}
        />
      )}
      {children}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .gradient-btn {
          background-size: 200% 200%;
          animation: gradient-shift-btn 4s ease infinite;
        }
        @keyframes gradient-shift-btn {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </button>
  );
}
