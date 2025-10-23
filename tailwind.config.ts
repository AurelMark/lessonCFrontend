// tailwind.config.ts
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  safelist: [
    'animate-spinOnce',
    'animate-wiggle',
  ],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        spinOnce: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeSlideUp: {
          "0%": { opacity: "0", transform: "translateY(50%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeSlideLeft: {
          "0%": { opacity: "0", transform: "translateX(-50%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeSlideRight: {
          "0%": { opacity: "0", transform: "translateX(50%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      raise: {
        '0%': { transform: 'translateY(100%)' },
        '100%': { transform: 'translateY(0)' },
      },
      rise: {
        '0%': { transform: 'translateY(50%)' },
        '100%': { transform: 'translateY(0)' },
      },
    },
    animation: {
      wiggle: 'wiggle 0.5s ease-in-out',
      spinOnce: 'spinOnce 0.6s ease-in-out',
      "caret-blink": "caret-blink 1.25s ease-out infinite",
      "accordion-down": "accordion-down 300ms ease-out",
      "accordion-up": "accordion-up 300ms ease-out",
      "fade-in": "fadeIn 1s ease-out forwards",
      raise: 'raise 1.5s ease-out forwards',
      rise: 'rise 1.5s ease-out forwards',
      "fade-slide-up": "fadeSlideUp 0.8s ease-out forwards",
      'fade-slide-left': 'fadeSlideLeft 1s ease forwards',
      'fade-slide-right': 'fadeSlideRight 1s ease forwards',
    },
  },
  plugins: [animate, typography],
}

export default config
