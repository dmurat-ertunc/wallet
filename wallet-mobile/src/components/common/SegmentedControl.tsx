import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

import { AppText } from './AppText';

// Tek bir segment: arka planda tutulan değer ve ekranda görünen yazı
export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

// <T extends string> generic tip: hangi değer türüyle kullanılırsa onChange o tipte değer döndürür
type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  // Seçili segmentin değeri
  value: T;
  onChange: (value: T) => void;
};

// Aynı ekranın farklı görünümleri arasında geçiş için tek satırda eşit genişlikte sekmeler.
// Örnek: Yeni Harcama ekranındaki "Elle ekle" / "Fotoğraf ile ekle".
export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    // accessibilityRole: ekran okuyuculara bunun bir sekme listesi olduğunu söyler
    <View style={[styles.container, { backgroundColor: theme.surface }]} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            // Sadece seçili segment tema renginde dolu görünür
            style={[styles.segment, selected && { backgroundColor: theme.primary }]}>
            <AppText variant="caption" color={selected ? 'onPrimary' : 'text'} style={styles.label}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Segmentleri saran gri kutu
  container: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  // flex: 1 → her segment eşit genişlikte olur
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  label: { fontWeight: '600' },
});
