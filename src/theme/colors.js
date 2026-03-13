// src/theme/colors.js
export const darkTheme = {
  bg: {
    primary: '#080810',
    secondary: '#0F0F1A',
    card: '#13131F',
    elevated: '#1A1A2E',
    input: '#1E1E30',
  },
  accent: {
    primary: '#00F5A0',    // Electric mint
    secondary: '#00D9F5',  // Cyan
    tertiary: '#FF6B35',   // Flame orange
    purple: '#8B5CF6',     // Violet
    gold: '#F59E0B',       // Amber
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0C0',
    muted: '#606080',
    inverse: '#080810',
  },
  border: {
    subtle: '#1E1E30',
    default: '#2A2A40',
    accent: '#00F5A0',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
};

export const lightTheme = {
  bg: {
    primary: '#F0F4F8',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
    elevated: '#F7F9FC',
    input: '#EEF2F7',
  },
  accent: {
    primary: '#00C47D',
    secondary: '#0099C9',
    tertiary: '#FF6B35',
    purple: '#7C3AED',
    gold: '#D97706',
  },
  text: {
    primary: '#0A0A14',
    secondary: '#4A4A6A',
    muted: '#8A8AAA',
    inverse: '#FFFFFF',
  },
  border: {
    subtle: '#E2E8F0',
    default: '#CBD5E1',
    accent: '#00C47D',
  },
  status: {
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
  }
};

// Typography scale
export const typography = {
  display: { fontSize: 36, fontWeight: '800', letterSpacing: -1.5 },
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.8 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  h3: { fontSize: 18, fontWeight: '600', letterSpacing: -0.3 },
  h4: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 22 },
  bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 26 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
};

// Spacing system
export const spacing = {
  xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 40, '4xl': 48,
};

// Border radius
export const radius = {
  sm: 6, md: 10, lg: 14, xl: 18, '2xl': 24, full: 999,
};

// Shadows
export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  glow: (color) => ({ shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 }),
};
