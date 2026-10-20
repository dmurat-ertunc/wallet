import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontSize, type ThemeColors } from '@/constants';
import { useTheme } from '@/hooks';

type Variant = 'title' | 'subtitle' | 'body' | 'caption';

export type AppTextProps = TextProps & {
  variant?: Variant;
  color?: keyof ThemeColors;
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  return <Text style={[styles[variant], { color: theme[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  title: { fontSize: FontSize.xl, fontWeight: '700' },
  subtitle: { fontSize: FontSize.lg, fontWeight: '600' },
  body: { fontSize: FontSize.md },
  caption: { fontSize: FontSize.sm },
});
