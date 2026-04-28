// src/constants/colors.ts
// Single source of truth for every color in the app.
// If the brand color changes, we can change it here — nowhere else.

export const Colors = {
  primary: '#7C3AED',
  primaryLight: '#A855F7',
  primaryMuted: '#C4AEFF',
  primarySurface: '#EDE9FF',
  primaryDeep: '#1A0533',

  surface: '#F8F7FF',
  white: '#FFFFFF',
  border: '#EDE9FF',

  textPrimary: '#1A0F3A',
  textSecondary: '#2D1B69',
  textMuted: '#8B7DB5',
  textHint: '#B0A0C8',

  success: '#22C55E',
  successSurface: '#DCFCE7',
  successText: '#166534',

  warning: '#F59E0B',
  warningSurface: '#FEF9C3',
  warningText: '#854D0E',

  danger: '#EF4444',
  dangerSurface: '#FEE2E2',
  dangerText: '#991B1B',
} as const;