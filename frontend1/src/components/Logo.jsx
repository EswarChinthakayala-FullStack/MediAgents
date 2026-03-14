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

    const sizes = {
        xs: { icon: 20, fontSize: "14px", gap: "6px" },
        sm: { icon: 28, fontSize: "18px", gap: "8px" },
        md: { icon: 40, fontSize: "24px", gap: "10px" },
        lg: { icon: 60, fontSize: "32px", gap: "14px" },
        xl: { icon: 90, fontSize: "48px", gap: "20px" },
    };

    const s = sizes[size];
    const iconSize = s.icon;
    const V = 100; // Fixed viewBox for easier geometry

    const colors = theme === "dark" 
        ? { primary: "#10B981", text: "#FFFFFF", ai: "#10B981" }
        : { primary: "#059669", text: "#09090b", ai: "#059669" };

    const animStyle = animated ? `
        @keyframes spark-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2%); }
        }
        .logo-spark { 
            animation: spark-pulse 2s ease-in-out infinite; 
            transform-origin: center;
        }
        .logo-container { animation: float 6s ease-in-out infinite; }
    ` : "";

    const IconSVG = (
        <svg
            width={iconSize}
            height={iconSize}
            viewBox={`0 0 ${V} ${V}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={animated ? "logo-container" : ""}
            style={{ flexShrink: 0 }}
        >
            <style>{animStyle}</style>
            
            {/* Geometric Cross Segments - Modern & Minimalist */}
            <g className="logo-segments">
                {/* Top Segment */}
                <path 
                    d="M50 5 L65 20 L50 35 L35 20 Z" 
                    fill={colors.primary} 
                    fillOpacity="0.9"
                />
                {/* Right Segment */}
                <path 
                    d="M95 50 L80 65 L65 50 L80 35 Z" 
                    fill={colors.primary} 
                    fillOpacity="1"
                />
                {/* Bottom Segment */}
                <path 
                    d="M50 95 L35 80 L50 65 L65 80 Z" 
                    fill={colors.primary} 
                    fillOpacity="0.8"
                />
                {/* Left Segment */}
                <path 
                    d="M5 50 L20 35 L35 50 L20 65 Z" 
                    fill={colors.primary} 
                    fillOpacity="0.7"
                />
            </g>

            {/* Central Spark / AI Node */}
            <circle 
                cx="50" cy="50" r="8" 
                fill={colors.text} 
                className="logo-spark"
            />
            
            {/* Subtle Gradient Glow (Transparent Background) */}
            <defs>
                <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="25" fill="url(#sparkGlow)" />
        </svg>
    );

    if (variant === "icon") return <div className={className}>{IconSVG}</div>;

    return (
        <div className={`inline-flex items-center ${className}`} style={{ gap: s.gap }}>
            {IconSVG}
            {variant !== "icon" && (
                <div className="flex flex-col leading-none">
                    <span style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 800,
                        fontSize: s.fontSize,
                        color: colors.text,
                        letterSpacing: "-0.02em"
                    }}>
                        Clinic<span style={{ color: colors.ai }}>AI</span>
                    </span>
                </div>
            )}
        </div>
    );
}