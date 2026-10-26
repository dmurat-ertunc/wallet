import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Shadows, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

// View'in tüm özellikleri (style, children, onLayout...) + iç boşluk seçeneği
type CardProps = ViewProps & {
  // false ise iç boşluk verilmez (ör. içine kenara dayalı bir resim veya liste konacaksa)
  padded?: boolean;
};

// İçeriği arka plandan ayıran yuvarlak köşeli, hafif gölgeli kutu.
// Liste satırları, özet kutuları, ayar grupları gibi her "kart" görünümü için bu kullanılır.
export function Card({ padded = true, style, ...rest }: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        { backgroundColor: theme.surface, borderColor: theme.border },
        // Dışarıdan verilen stil en sonda, gerekirse yukarıdakileri ezer
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    // Çok ince çerçeve: karanlık temada gölge görünmediği için kartı arka plandan bu ayırır
    borderWidth: StyleSheet.hairlineWidth,
    boxShadow: Shadows.sm,
  },
  padded: { padding: Spacing.md },
});
