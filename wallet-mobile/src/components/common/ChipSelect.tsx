import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

import { AppText } from './AppText';
import { FormField } from './FormField';

// Tek bir seçenek: arka planda tutulan değer (ör. 'FOOD') ve ekranda görünen yazı (ör. 'Yemek')
export type ChipOption<T extends string> = {
  value: T;
  label: string;
};

// <T extends string> generic tip: hangi enum ile kullanılırsa onChange o tipte değer döndürür
type ChipSelectProps<T extends string> = {
  label: string;
  options: ChipOption<T>[];
  // Seçili değer; null ise henüz hiçbir şey seçilmemiş
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
  // Sayfaya özel ekstra stil (alanı saran kutuya uygulanır)
  style?: StyleProp<ViewStyle>;
};

// Kısa bir listeden tek seçim: yan yana dizilen, sığmayınca alt satıra geçen dokunulabilir "çipler"
export function ChipSelect<T extends string>({ label, options, value, onChange, error, style }: ChipSelectProps<T>) {
  const theme = useTheme();

  return (
    <FormField label={label} error={error} style={style}>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              // Listede her elemanın benzersiz bir key'i olmalı
              key={option.value}
              onPress={() => onChange(option.value)}
              // Ekran okuyucular için: bu bir seçenek düğmesi ve seçili olup olmadığı
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[
                styles.chip,
                {
                  // Seçiliyse açık ana renk zemin ve ana renk çerçeve, değilse yüzey rengi
                  backgroundColor: selected ? theme.primarySoft : theme.surface,
                  // Seçili değilken hata varsa çerçeve kırmızı olur
                  borderColor: selected ? theme.primary : error ? theme.danger : theme.border,
                },
              ]}>
              <AppText variant="label" color={selected ? 'primary' : 'text'}>
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  // flexWrap: 'wrap' → çipler satıra sığmayınca alt satıra geçer
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  // Hap şeklinde çip (tam yuvarlak köşeler)
  chip: {
    borderWidth: 1.5,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
});
