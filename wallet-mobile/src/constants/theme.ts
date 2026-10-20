export const Colors = {
  light: {
    primary: '#208AEF',
    text: '#11181C',
    textSecondary: '#60646C',
    background: '#FFFFFF',
    surface: '#F0F0F3',
    border: '#E0E1E6',
    danger: '#E5484D',
    onPrimary: '#FFFFFF',
  },
  dark: {
    primary: '#3B9EFF',
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    background: '#000000',
    surface: '#212225',
    border: '#2E3135',
    danger: '#FF6369',
    onPrimary: '#FFFFFF',
  },
} as const;

export type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 12,
  lg: 20,
} as const;

export const FontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
} as const;
