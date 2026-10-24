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

// Etiketli ve hata mesajlı metin girişi
export function AppInput({ label, error, optional, style, multiline, ...rest }: AppInputProps) {
  const theme = useTheme();

  return (
    <FormField label={label} error={error} optional={optional}>
      <TextInput
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        style={[
          styles.input,
          // Çok satırlıysa daha yüksek bir kutu
          multiline && styles.multiline,
          {
            color: theme.text,
            backgroundColor: theme.surface,
            // Hata varsa çerçeve kırmızı olur
            borderColor: error ? theme.danger : theme.border,
          },
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
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs,
    fontSize: FontSize.md,
  },
  multiline: {
    minHeight: 96,
    // Android'de çok satırlı alanda yazı ortadan değil üstten başlasın
    textAlignVertical: 'top',
  },
});
