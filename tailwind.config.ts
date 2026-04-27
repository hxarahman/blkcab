import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ['Acid Grotesk', 'system-ui', 'sans-serif'],
        accent: ['Lastik', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "basin-green": "hsl(var(--basin-green))",
        "cab-black": "hsl(var(--cab-black))",
        "off-white": "hsl(var(--off-white))",
        "undergrad": "hsl(var(--undergrad))",
        "pale-blue": "hsl(var(--pale-blue))",
        brass: "hsl(var(--brass))",
        caramel: "hsl(var(--caramel))",
        "pale-olive": "hsl(var(--pale-olive))",
        "golden-lime": "hsl(var(--golden-lime))",
        olive: "hsl(var(--olive))",
        matcha: "hsl(var(--matcha))",
        coffee: "hsl(var(--coffee))",
        cream: "hsl(var(--cream))",
        "orange-sticker": "hsl(var(--orange-sticker))",
        "bc-blue": "hsl(var(--bc-blue))",
        "maze-wall": "hsl(var(--maze-wall))",
        "maze-wall-edge": "hsl(var(--maze-wall-edge))",
        "maze-path": "hsl(var(--maze-path))",
        hazard: "hsl(var(--hazard))",
      },
      // NEW
      backgroundImage: {
        "gradient-brand": "var(--gradient-brand)",
        "gradient-dark": "var(--gradient-dark)",
      },
      boxShadow: {
        olive: "var(--shadow-olive)",
        orange: "var(--shadow-orange)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "shake": {
          "0%,100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-4px,2px)" },
          "40%": { transform: "translate(4px,-2px)" },
          "60%": { transform: "translate(-3px,-2px)" },
          "80%": { transform: "translate(3px,2px)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "1", filter: "brightness(1) drop-shadow(0 0 4px hsl(var(--olive-glow) / 0.6))" },
          "50%": { opacity: "0.9", filter: "brightness(1.5) drop-shadow(0 0 12px hsl(var(--olive-glow) / 0.9))" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-fast": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1", filter: "brightness(1)" },
          "20%, 24%, 55%": { opacity: "0.4", filter: "brightness(0.6)" },
        },
        "headlight-sweep": {
          "0%": { transform: "translateX(-30%) rotate(-8deg)", opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateX(130%) rotate(8deg)", opacity: "0" },
        },
        "fog-drift": {
          "0%": { transform: "translateX(-10%) translateY(0)" },
          "100%": { transform: "translateX(10%) translateY(-4%)" },
        },
        "ticker-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "swipe-hint": {
          "0%, 100%": { opacity: "0.25", transform: "translateY(0)" },
          "50%": { opacity: "0.75", transform: "translateY(-6px)" },
        },
        "wall-hum": {
          "0%, 100%": { filter: "drop-shadow(0 0 1px hsl(var(--maze-wall-glow) / 0.3))" },
          "50%": { filter: "drop-shadow(0 0 4px hsl(var(--maze-wall-glow) / 0.6))" },
        },
        "fly-up": {
          "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0.65)" },
          "15%": { opacity: "1", transform: "translate(-50%, calc(-50% - 4vh)) scale(1.33)" },
          "70%": { opacity: "1", transform: "translate(-50%, calc(-50% - 55vh)) scale(1.05)" },
          "100%": { opacity: "0", transform: "translate(-50%, calc(-50% - 95vh)) scale(0.77)" },
        },
        "sticker-pop": {
          "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0.6) rotate(-6deg)" },
          "20%": { opacity: "1", transform: "translate(-50%, calc(-50% - 4vh)) scale(1.4) rotate(2deg)" },
          "70%": { opacity: "1", transform: "translate(-50%, calc(-50% - 55vh)) scale(1.12) rotate(4deg)" },
          "100%": { opacity: "0", transform: "translate(-50%, calc(-50% - 95vh)) scale(0.84) rotate(8deg)" },
        },
        "spotlight-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "1", transform: "translate(-50%, -50%) scale(1.25)" },
        },
        "cab-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "stamp-down": {
          "0%": { opacity: "0", transform: "rotate(-7deg) scale(2.4) translateY(-30px)" },
          "55%": { opacity: "1", transform: "rotate(-7deg) scale(0.9) translateY(2px)" },
          "70%": { transform: "rotate(-7deg) scale(1.05) translateY(-1px)" },
          "85%": { transform: "rotate(-7deg) scale(0.98) translateY(0)" },
          "100%": { opacity: "1", transform: "rotate(-7deg) scale(1) translateY(0)" },
        },
        "stamp-loop": {
          "0%, 70%, 100%": { transform: "rotate(-7deg) scale(1) translateY(0)", opacity: "1" },
          "78%": { opacity: "0", transform: "rotate(-7deg) scale(2.2) translateY(-22px)" },
          "92%": { opacity: "1", transform: "rotate(-7deg) scale(0.95) translateY(1px)" },
        },
        "you-pulse": {
          "0%, 100%": { opacity: "0.85", filter: "drop-shadow(0 0 6px hsl(var(--cream) / 0.5))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 16px hsl(var(--cream) / 0.95)) drop-shadow(0 0 28px hsl(var(--olive-glow) / 0.7))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shake": "shake 0.4s ease-in-out",
        "pulse-glow": "pulse-glow 1.4s ease-in-out infinite",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-up": "slide-up 0.5s ease-out both",
        "marquee": "marquee 22s linear infinite",
        "marquee-fast": "marquee-fast 12s linear infinite",
        "neon-flicker": "neon-flicker 4s linear infinite",
        "headlight-sweep": "headlight-sweep 5s ease-in-out infinite",
        "fog-drift": "fog-drift 14s ease-in-out infinite alternate",
        "ticker-pulse": "ticker-pulse 1.4s ease-in-out infinite",
        "swipe-hint": "swipe-hint 2.4s ease-in-out infinite",
        "wall-hum": "wall-hum 3.5s ease-in-out infinite",
        "fly-up": "fly-up 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "sticker-pop": "sticker-pop 2.0s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "spotlight-pulse": "spotlight-pulse 1.6s ease-in-out infinite",
        "cab-bounce": "cab-bounce 1.6s ease-in-out infinite",
        "stamp-loop": "stamp-loop 4s ease-in-out infinite",
        "you-pulse": "you-pulse 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
