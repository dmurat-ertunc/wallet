import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

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
  // Sayfaya özel ekstra stil (alanı saran kutuya uygulanır)
  style?: StyleProp<ViewStyle>;
};

// Tüm form alanlarının ortak iskeleti: üstte etiket, ortada giriş, altta hata mesajı.
// AppInput, ChipSelect ve DateField bunu kullandığı için hepsi aynı görünür.
export function FormField({ label, error, optional = false, children, style }: FormFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <AppText variant="label" color="textSecondary">
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
  // Etiket, giriş ve hata arasında 8 piksel boşluk
  field: { gap: Spacing.sm },
});
