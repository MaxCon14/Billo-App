import { Platform } from 'react-native';

// ─── Billo Dark Design System ─────────────────────────────────────
// Dark-mode only. No light mode.

export const colors = {
  background: '#0A0A0A',
  surface: '#161616',
  surfaceRaised: '#1E1E1E',
  border: '#2A2A2A',
  foreground: '#FFFFFF',
  muted: '#787878',

  accent: {
    yellow: '#F5E642',
    green: '#4ADE80',
    pink: '#F472B6',
  },

  destructive: '#EF4444',

  // Kept for backward compat in components being migrated
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Legacy palette aliases — components reference these during migration
  primary: {
    50: '#1A1A00',
    100: '#2A2A00',
    200: '#3D3D00',
    300: '#6B6B00',
    400: '#C4C400',
    500: '#DDD530',
    600: '#F5E642',
    700: '#F5E642',
    800: '#C4B800',
    900: '#8A8200',
  },
  stone: {
    50: '#0A0A0A',
    100: '#161616',
    200: '#1E1E1E',
    300: '#2A2A2A',
    400: '#787878',
    500: '#787878',
    600: '#787878',
    700: '#2A2A2A',
    800: '#161616',
    900: '#FFFFFF',
  },
  red: {
    50: '#1A0A0A',
    100: '#2A1010',
    200: '#3A1515',
    300: '#EF4444',
    400: '#EF4444',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  green: {
    50: '#0A1A0F',
    100: '#102A18',
    200: '#153A22',
    300: '#4ADE80',
    400: '#4ADE80',
    500: '#4ADE80',
    600: '#22C55E',
  },
  amber: {
    50: '#1A1800',
    100: '#2A2700',
    200: '#F5E642',
    300: '#F5E642',
    400: '#F5E642',
    500: '#F5E642',
    600: '#DDD530',
  },
};

export const shadows = {
  sm: {} as Record<string, any>,
  md: {} as Record<string, any>,
  lg: {} as Record<string, any>,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const typography = {
  heading: {
    fontFamily: 'Syne_800ExtraBold',
    fontSize: 28,
    letterSpacing: -0.56,
  },
  body: {
    fontFamily: 'Syne_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  label: {
    fontFamily: 'Syne_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
};
