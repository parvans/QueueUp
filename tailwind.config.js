/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          dark: "#004AC6",
          container: "#2563EB",
          light: "#DBE1FF",
          subtle: "#EFF6FF",
        },
        secondary: {
          DEFAULT: "#1E40AF",
          container: "#708CFD",
          light: "#DDE1FF",
        },
        tertiary: {
          DEFAULT: "#10B981",
          dark: "#006242",
          container: "#007D55",
          light: "#ECFDF5",
        },
        surface: {
          DEFAULT: "#FAF8FF",
          canvas: "#F8FAFC",
          dim: "#D2D9F4",
          bright: "#FAF8FF",
          variant: "#DAE2FD",
          card: "#FFFFFF",
          container: {
            lowest: "#FFFFFF",
            low: "#F2F3FF",
            DEFAULT: "#EAEDFF",
            high: "#E2E7FF",
            highest: "#DAE2FD",
          },
        },
        ink: {
          DEFAULT: "#0F172A",
          title: "#131B2E",
          body: "#434655",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        status: {
          success: "#10B981",
          successBg: "#ECFDF5",
          warning: "#F59E0B",
          warningBg: "#FFFBEB",
          error: "#EF4444",
          errorBg: "#FEF2F2",
          info: "#2563EB",
          infoBg: "#EFF6FF",
        },
        border: {
          DEFAULT: "#E2E8F0",
          subtle: "#F1F5F9",
          strong: "#CBD5E1",
          variant: "#C3C6D7",
        },
        ios: {
          title: "#1D1D1F",
          subtext: "#86868B",
          bg: "#F5F5F7",
          border: "#D2D2D7",
          blue: "#0071E3",
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};