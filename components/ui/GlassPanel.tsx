import React from "react";

interface GlassPanelProps {
  children?: React.ReactNode;
  blur?: number;
  opacity?: number;
  radius?: "sm" | "md" | "lg" | "xl" | "2xl";
  glow?: boolean;
  glowColor?: string;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

const radiusMap: Record<string, string> = {
  sm:  "var(--radius-sm)",
  md:  "var(--radius-md)",
  lg:  "var(--radius-lg)",
  xl:  "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
};

export function GlassPanel({
  children,
  blur = 20,
  opacity = 0.72,
  radius = "xl",
  glow = false,
  glowColor = "rgba(102, 126, 234, 0.18)",
  padding,
  className = "",
  style = {},
  as: Tag = "div",
}: GlassPanelProps) {
  const resolvedRadius = radiusMap[radius] ?? radiusMap.xl;

  const panelStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: "1.5px solid rgba(255, 255, 255, 0.50)",
    borderRadius: resolvedRadius,
    boxShadow: glow
      ? `0 8px 32px ${glowColor}, 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.90)`
      : "0 8px 32px rgba(102, 126, 234, 0.12), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.90)",
    ...(padding ? { padding } : {}),
    ...style,
  };

  return (
    <Tag className={className} style={panelStyle}>
      {children}
    </Tag>
  );
}
