import { type ReactNode, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

import { FormField } from './FormField';

// TextInput'un tüm özellikleri (value, onChangeText, keyboardType...) + form alanı özellikleri
type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  optional?: boolean;
  // Kutunun sağ içinde gösterilecek öğe (ör. şifreyi göster/gizle ikonu)
  trailing?: ReactNode;
};

// Etiketli ve hata mesajlı metin girişi. Odaklanınca çerçevesi ana renge döner.
export function AppInput({
  label,
  error,
  optional,
  trailing,
  style,
  multiline,
  onFocus,
  onBlur,
  ...rest
}: AppInputProps) {
  const theme = useTheme();
  // Kutuya şu an yazı yazılıyor mu; çerçeve rengini belirler
  const [focused, setFocused] = useState(false);

  // Öncelik: hata kırmızısı > odak rengi > normal çerçeve
  const borderColor = error ? theme.danger : focused ? theme.primary : theme.border;

  return (
    <FormField label={label} error={error} optional={optional}>
      {/* Çerçeve ve zemin dıştaki kutuda; böylece trailing öğesi de çerçevenin içinde durur */}
      <View style={[styles.box, { backgroundColor: theme.surface, borderColor }]}>
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
            { color: theme.text },
            // Dışarıdan verilen stil en sonda, gerekirse yukarıdakileri ezer
            style,
          ]}
          // Geri kalan tüm özellikler (value, onChangeText, maxLength...) olduğu gibi TextInput'a aktarılır
          {...rest}
        />
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </FormField>
  );
}

const styles = StyleSheet.create({
  // Yazı alanı ve trailing öğesi yan yana
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
  },
  input: {
    // Kalan genişliği yazı alanı kaplar, trailing sağa itilir
    flex: 1,
    minHeight: 50,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs,
    fontSize: FontSize.md,
  },
  multiline: {
    minHeight: 104,
    // Android'de çok satırlı alanda yazı ortadan değil üstten başlasın
    textAlignVertical: 'top',
  },
  trailing: { paddingRight: Spacing.md },
});
