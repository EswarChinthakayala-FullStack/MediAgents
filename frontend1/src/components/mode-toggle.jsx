import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [animating, setAnimating] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Sync isDark with resolved theme (handles "system" too)
  useEffect(() => {
    const resolved =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : theme === "dark"
    setIsDark(resolved)
  }, [theme])

  const toggle = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark")
      setAnimating(false)
    }, 320)
  }

  return (
    <>
      <style>{`
        .mode-toggle-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          
          background: transparent
          color: var(--foreground);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: border-color 200ms ease, background 200ms ease;
          flex-shrink: 0;
        }
      
        .mode-toggle-btn:active {
          transform: scale(0.94);
        }

        /* ripple burst on click */
        .toggle-ripple {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: var(--primary);
          opacity: 0;
          transform: scale(0);
          pointer-events: none;
        }
        .toggle-ripple.burst {
          animation: ripple-burst 320ms ease-out forwards;
        }

        /* icon wrapper — shared slide track */
        .toggle-icon-track {
          position: relative;
          width: 18px;
          height: 18px;
        }

        /* Sun icon */
        .toggle-sun {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 220ms ease, transform 320ms cubic-bezier(0.34,1.56,0.64,1);
          color: var(--foreground);
        }
        /* Dark mode: sun exits upward */
        .dark .toggle-sun {
          opacity: 0;
          transform: translateY(-110%) rotate(-40deg);
        }
        /* Animating to dark: sun exits */
        .toggle-sun.exit-up {
          opacity: 0 !important;
          transform: translateY(-110%) rotate(-40deg) !important;
          transition: opacity 200ms ease, transform 220ms cubic-bezier(0.4,0,1,1) !important;
        }
        /* Animating to light: sun enters */
        .toggle-sun.enter-down {
          opacity: 1 !important;
          transform: translateY(0) rotate(0deg) !important;
          transition: opacity 200ms ease 120ms, transform 260ms cubic-bezier(0.34,1.56,0.64,1) 120ms !important;
        }

        /* Moon icon */
        .toggle-moon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 220ms ease, transform 320ms cubic-bezier(0.34,1.56,0.64,1);
          color: var(--primary);
          /* Light mode: moon sits below */
          opacity: 0;
          transform: translateY(110%) rotate(40deg);
        }
        /* Dark mode: moon is visible */
        .dark .toggle-moon {
          opacity: 1;
          transform: translateY(0) rotate(0deg);
        }
        /* Animating to dark: moon enters */
        .toggle-moon.enter-up {
          opacity: 1 !important;
          transform: translateY(0) rotate(0deg) !important;
          transition: opacity 200ms ease 120ms, transform 260ms cubic-bezier(0.34,1.56,0.64,1) 120ms !important;
        }
        /* Animating to light: moon exits */
        .toggle-moon.exit-down {
          opacity: 0 !important;
          transform: translateY(110%) rotate(40deg) !important;
          transition: opacity 200ms ease, transform 220ms cubic-bezier(0.4,0,1,1) !important;
        }

        @keyframes ripple-burst {
          0%   { opacity: 0.18; transform: scale(0); }
          60%  { opacity: 0.10; transform: scale(1.4); }
          100% { opacity: 0;    transform: scale(1.8); }
        }
      `}</style>

      <Button
        className="mode-toggle-btn border-none shadow-none"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {/* ripple */}
        <span className={`toggle-ripple ${animating ? "burst" : ""}`} />

        {/* icon track */}
        <span className="toggle-icon-track">
          {/* Sun */}
          <span
            className={`toggle-sun ${
              animating && isDark
                ? "exit-up"
                : animating && !isDark
                ? "enter-down"
                : ""
            }`}
          >
            <Sun size={16} strokeWidth={2} />
          </span>

          {/* Moon */}
          <span
            className={`toggle-moon ${
              animating && isDark
                ? "enter-up"
                : animating && !isDark
                ? "exit-down"
                : ""
            }`}
          >
            <Moon size={15} strokeWidth={2} />
          </span>
        </span>
      </Button>
    </>
  )
}