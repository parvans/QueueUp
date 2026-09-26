/**
 * QueueUp Precision Humanist Design System Tokens
 * Source of truth: Stitch Project "QueueUp Mobile App Design"
 */

export const Colors = {
  // Brand & Accents
  primary: {
    DEFAULT: "#2563EB", // Vibrant Royal Cobalt
    dark: "#004AC6",
    container: "#2563EB",
    light: "#DBE1FF",
    subtle: "#EFF6FF",
  },
  secondary: {
    DEFAULT: "#1E40AF", // Deep Indigo
    container: "#708CFD",
    light: "#DDE1FF",
  },
  tertiary: {
    DEFAULT: "#10B981", // Crisp Emerald Green
    dark: "#006242",
    container: "#007D55",
    light: "#ECFDF5",
  },

  // Surfaces & Backgrounds
  surface: {
    DEFAULT: "#FAF8FF",
    canvas: "#F8FAFC",
    dim: "#D2D9F4",
    bright: "#FAF8FF",
    variant: "#DAE2FD",
    card: "#FFFFFF",
    containerLowest: "#FFFFFF",
    containerLow: "#F2F3FF",
    container: "#EAEDFF",
    containerHigh: "#E2E7FF",
    containerHighest: "#DAE2FD",
  },

  // Text / Inks
  ink: {
    DEFAULT: "#0F172A",
    title: "#131B2E",
    body: "#434655",
    muted: "#64748B",
    subtle: "#94A3B8",
  },

  // Semantic Status
  status: {
    success: "#10B981",
    successBg: "#ECFDF5",
    successText: "#065F46",
    warning: "#F59E0B",
    warningBg: "#FFFBEB",
    warningText: "#92400E",
    error: "#EF4444",
    errorBg: "#FEF2F2",
    errorText: "#991B1B",
    info: "#2563EB",
    infoBg: "#EFF6FF",
    infoText: "#1E40AF",
  },

  // Borders & Dividers
  border: {
    DEFAULT: "#E2E8F0",
    subtle: "#F1F5F9",
    strong: "#CBD5E1",
    variant: "#C3C6D7",
  },

  // Apple Cupertino accents
  ios: {
    title: "#1D1D1F",
    subtext: "#86868B",
    bg: "#F5F5F7",
    border: "#D2D2D7",
    blue: "#0071E3",
  },
};

export const Shadows = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  elevated: {
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  modal: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
};
