/**
 * Clean White Minimal Theme — inspired by modern travel/utility app UI.
 * White base, black accents, soft shadows, no color.
 */

import { Platform } from 'react-native';

export const Theme = {
  colors: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FA',
    bgInput: '#F1F3F5',
    surface: '#FFFFFF',

    black: '#1A1A1A',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A5568',
    textMuted: '#A0AEC0',
    textOnDark: '#FFFFFF',

    border: '#E2E8F0',
    borderLight: '#EDF2F7',
    divider: '#E2E8F0',

    overlay: 'rgba(0,0,0,0.4)',
    activeChip: '#1A1A1A',
  },

  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 100 },

  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    soft: {
      shadowColor: '#000000',
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
  },
} as const;

export const PRIORITY_COLORS: Record<string, string> = {
  Low: '#718096',
  Medium: '#4A5568',
  High: '#1A1A1A',
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

export const Colors = {
  light: { text: '#1A1A1A', background: '#FFFFFF', tint: '#1A1A1A', icon: '#6B7280', tabIconDefault: '#9CA3AF', tabIconSelected: '#1A1A1A' },
  dark: { text: '#1A1A1A', background: '#FFFFFF', tint: '#1A1A1A', icon: '#6B7280', tabIconDefault: '#9CA3AF', tabIconSelected: '#1A1A1A' },
};
