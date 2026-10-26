import { Text, type TextProps } from 'react-native';

import { Typography, type ThemeColors, type TypographyVariant } from '@/constants';
import { useTheme } from '@/hooks';

// React Native'in Text özelliklerinin hepsi + iki ek özellik
export type AppTextProps = TextProps & {
  // Yazı stili: 'display' | 'title' | 'subtitle' | 'body' | 'bodyStrong' | 'label' | 'caption' | 'overline'.
  // Değerler theme.ts'teki Typography'den gelir; varsayılan 'body'
  variant?: TypographyVariant;
  // Temadaki bir rengin adı (ör. 'danger'); doğrudan renk kodu yerine bu kullanılır ki karanlık modda doğru renk seçilsin
  color?: keyof ThemeColors;
};

// Projedeki tüm yazılar Text yerine bununla yazılır; böylece boyutlar ve renkler her yerde tutarlı olur
export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  // Stil sırası önemli: önce türün stili, sonra renk, en son dışarıdan gelen style (hepsini ezebilir)
  return <Text style={[Typography[variant], { color: theme[color] }, style]} {...rest} />;
}
