import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants';

import { AppText } from './AppText';

type FormFieldProps = {
  // Alanın üstünde görünen etiket (ör. "Tutar")
  label: string;
  // Varsa alanın altında kırmızı gösterilen hata mesajı
  error?: string;
  // true ise etiketin yanına "(isteğe bağlı)" eklenir
  optional?: boolean;
  // Asıl giriş bileşeni (TextInput, çipler, tarih seçici...)
  children: ReactNode;
};

// Tüm form alanlarının ortak iskeleti: üstte etiket, ortada giriş, altta hata mesajı.
// AppInput, ChipSelect ve DateField bunu kullandığı için hepsi aynı görünür.
export function FormField({ label, error, optional = false, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" color="textSecondary" style={styles.label}>
        {label}
        {optional ? ' (isteğe bağlı)' : ''}
      </AppText>
      {children}
      {/* Hata yoksa hiçbir şey çizilmez (null) */}
      {error ? (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Etiket, giriş ve hata arasında 4 piksel boşluk
  field: { gap: Spacing.xs },
  label: { fontWeight: '600' },
});
