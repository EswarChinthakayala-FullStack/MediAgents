import React, { useState } from "react";
import { useTheme } from "./theme-provider";

export default function Logo({
    size = "md",
    variant = "full",
    theme: explicitTheme,
    animated = true,
    className = "",
}) {
    const { resolvedTheme } = useTheme();
    const theme = explicitTheme || resolvedTheme || "dark";
    const [hovered, setHovered] = useState(false);

    const sizes = {
        xs: { icon: 20, fontSize: "14px", gap: "6px" },
        sm: { icon: 28, fontSize: "18px", gap: "8px" },
        md: { icon: 40, fontSize: "24px", gap: "10px" },
        lg: { icon: 60, fontSize: "32px", gap: "14px" },
        xl: { icon: 90, fontSize: "48px", gap: "20px" },
    };

    const s = sizes[size];
    const iconSize = s.icon;
    const V = 100;

    /* ── Theme-aware colors ── */
    const isDark = theme === "dark";
    const colors = isDark
        ? {
              primary:    "#3ECF8E",
              primaryDim: "rgba(62,207,142,0.18)",
              text:       "#FFFFFF",
              glow:       "rgba(62,207,142,0.35)",
          }
        : {
              primary:    "#1a9e6a",
              primaryDim: "rgba(26,158,106,0.15)",
              text:       "#0d1f18",
              glow:       "rgba(26,158,106,0.25)",
          };

    /* ── Text color: adapts to theme ── */
    const textColor = isDark ? "#ffffff" : "#0d1f18";

    const animStyle = `
        @keyframes spark-pulse {
            0%, 100% { opacity: 1;   transform: scale(1);   }
            50%       { opacity: 0.7; transform: scale(1.25); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0);    }
            50%       { transform: translateY(-2%); }
        }
        @keyframes spin-segments {
            from { transform: rotate(0deg);   }
            to   { transform: rotate(360deg); }
        }
        @keyframes spin-segments-reverse {
            from { transform: rotate(0deg);    }
            to   { transform: rotate(-360deg); }
        }
        @keyframes glow-pulse {
            0%, 100% { opacity: 0.5; r: 25; }
            50%       { opacity: 1;   r: 30; }
        }

        .logo-spark {
            animation: spark-pulse 2s ease-in-out infinite;
            transform-origin: 50px 50px;
        }
        .logo-float {
            animation: float 6s ease-in-out infinite;
        }

        /* Hover spin — segments rotate, inner spark counter-rotates to stay still */
        .logo-segments-group {
            transform-origin: 50px 50px;
            transition: transform 0.1s ease;
        }
        .logo-segments-group.spinning {
            animation: spin-segments 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .logo-spark.counter {
            animation: spark-pulse 2s ease-in-out infinite,
                       spin-segments-reverse 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .logo-glow-ring {
            transform-origin: 50px 50px;
            transition: opacity 0.25s ease;
        }
        .logo-glow-ring.active {
            opacity: 1 !important;
            animation: glow-pulse 0.7s ease-in-out forwards;
        }
    `;

    const IconSVG = (
        <svg
            width={iconSize}
            height={iconSize}
            viewBox={`0 0 ${V} ${V}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={animated ? "logo-float" : ""}
            style={{ flexShrink: 0, display: "block" }}
        >
            <style>{animStyle}</style>

            <defs>
                <radialGradient id={`sparkGlow-${theme}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor={colors.primary} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity="0"   />
                </radialGradient>
                {/* Subtle drop shadow filter for hovered state */}
                <filter id="logo-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            </defs>

            {/* Ambient glow ring — brightens on hover */}
            <circle
                cx="50" cy="50" r="38"
                fill={`url(#sparkGlow-${theme})`}
                className={`logo-glow-ring${hovered ? " active" : ""}`}
                style={{ opacity: hovered ? 1 : 0.5 }}
            />

            {/* Diamond segments — spin on hover */}
            <g className={`logo-segments-group${hovered ? " spinning" : ""}`}>
                {/* Top */}
                <path
                    d="M50 5 L65 20 L50 35 L35 20 Z"
                    fill={colors.primary}
                    fillOpacity={hovered ? "1" : "0.9"}
                    style={{ transition: "fill-opacity 0.2s ease" }}
                />
                {/* Right */}
                <path
                    d="M95 50 L80 65 L65 50 L80 35 Z"
                    fill={colors.primary}
                    fillOpacity={hovered ? "1" : "1"}
                />
                {/* Bottom */}
                <path
                    d="M50 95 L35 80 L50 65 L65 80 Z"
                    fill={colors.primary}
                    fillOpacity={hovered ? "1" : "0.8"}
                    style={{ transition: "fill-opacity 0.2s ease" }}
                />
                {/* Left */}
                <path
                    d="M5 50 L20 35 L35 50 L20 65 Z"
                    fill={colors.primary}
                    fillOpacity={hovered ? "1" : "0.7"}
                    style={{ transition: "fill-opacity 0.2s ease" }}
                />
            </g>

            {/* Central spark dot — counter-rotates to stay centered */}
            <circle
                cx="50" cy="50" r={hovered ? 9 : 8}
                fill={isDark?"#fff":"#000"}
                className={`logo-spark${hovered ? " counter" : ""}`}
                style={{ transition: "r 0.2s ease" }}
            />

            {/* Tiny accent ring around spark — visible on hover */}
            {hovered && (
                <circle
                    cx="50" cy="50" r="14"
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    style={{ animation: "glow-pulse 0.7s ease-in-out forwards" }}
                />
            )}
        </svg>
    );

    if (variant === "icon") {
        return (
            <div
                className={className}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{ display: "inline-flex", cursor: "pointer" }}
            >
                {IconSVG}
            </div>
        );
    }

    return (
        <div
            className={`inline-flex items-center ${className}`}
            style={{ gap: s.gap, cursor: "pointer" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {IconSVG}

            {variant !== "icon" && (
                <div className="flex flex-col leading-none">
                    <span
                        style={{
                            fontFamily:    "'Geist', 'SF Pro Display', Inter, system-ui, sans-serif",
                            fontWeight:    800,
                            fontSize:      s.fontSize,
                            letterSpacing: "-0.02em",
                            
                            transition:    "color 0.25s ease",
                        }}
                    >
                        Clinic
                        <span
                            style={{
                                color:      colors.primary,
                                transition: "color 0.25s ease, text-shadow 0.25s ease",
                                textShadow: hovered
                                    ? `0 0 12px ${colors.glow}`
                                    : "none",
                            }}
                        >
                            AI
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
}