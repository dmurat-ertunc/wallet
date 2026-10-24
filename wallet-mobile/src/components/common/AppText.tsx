import { StyleSheet, Text, type TextProps } from 'react-native';

import { FontSize, type ThemeColors } from '@/constants';
import { useTheme } from '@/hooks';

// Yazı türleri: başlık, alt başlık, normal metin, küçük açıklama
type Variant = 'title' | 'subtitle' | 'body' | 'caption';

// React Native'in Text özelliklerinin hepsi + iki ek özellik
export type AppTextProps = TextProps & {
  // Yazının boyutu ve kalınlığı; varsayılan 'body'
  variant?: Variant;
  // Temadaki bir rengin adı (ör. 'danger'); doğrudan renk kodu yerine bu kullanılır ki karanlık modda doğru renk seçilsin
  color?: keyof ThemeColors;
};

// Projedeki tüm yazılar Text yerine bununla yazılır; böylece boyutlar ve renkler her yerde tutarlı olur
export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const theme = useTheme();
  // Stil sırası önemli: önce türün stili, sonra renk, en son dışarıdan gelen style (hepsini ezebilir)
  return <Text style={[styles[variant], { color: theme[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  title: { fontSize: FontSize.xl, fontWeight: '700' },
  subtitle: { fontSize: FontSize.lg, fontWeight: '600' },
  body: { fontSize: FontSize.md },
  caption: { fontSize: FontSize.sm },
});
