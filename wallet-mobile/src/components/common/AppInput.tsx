import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

import { FormField } from './FormField';

// TextInput'un tüm özellikleri (value, onChangeText, keyboardType...) + form alanı özellikleri
type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  optional?: boolean;
};

// Etiketli ve hata mesajlı metin girişi. Odaklanınca çerçevesi ana renge döner.
export function AppInput({ label, error, optional, style, multiline, onFocus, onBlur, ...rest }: AppInputProps) {
  const theme = useTheme();
  // Kutuya şu an yazı yazılıyor mu; çerçeve rengini belirler
  const [focused, setFocused] = useState(false);

  // Öncelik: hata kırmızısı > odak rengi > normal çerçeve
  const borderColor = error ? theme.danger : focused ? theme.primary : theme.border;

  return (
    <FormField label={label} error={error} optional={optional}>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        selectionColor={theme.primary}
        multiline={multiline}
        // Dışarıdan onFocus/onBlur verilmişse onlar da çalışmaya devam eder
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          // Çok satırlıysa daha yüksek bir kutu
          multiline && styles.multiline,
          { color: theme.text, backgroundColor: theme.surface, borderColor },
          // Dışarıdan verilen stil en sonda, gerekirse yukarıdakileri ezer
          style,
        ]}
        // Geri kalan tüm özellikler (value, onChangeText, maxLength...) olduğu gibi TextInput'a aktarılır
        {...rest}
      />
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs,
    fontSize: FontSize.md,
  },
  multiline: {
    minHeight: 104,
    // Android'de çok satırlı alanda yazı ortadan değil üstten başlasın
    textAlignVertical: 'top',
  },
});
