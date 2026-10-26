import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing, type ThemeColors } from '@/constants';
import { useTheme } from '@/hooks';

import { AppText } from './AppText';

// Buton türleri:
// primary: dolu ana renk (sayfanın asıl eylemi), secondary: açık ana renk zemin,
// outline: sadece çerçeve, ghost: zeminsiz yazı, danger: kırmızı (silme gibi geri alınamaz eylemler)
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
// Buton boyutları
type Size = 'sm' | 'md' | 'lg';

type AppButtonProps = {
  // Buton üzerindeki yazı
  title: string;
  // Basılınca çağrılacak fonksiyon
  onPress: () => void;
  // Görünüm türü; varsayılan 'primary'
  variant?: Variant;
  // Boyut; varsayılan 'md'
  size?: Size;
  // true ise yazının yerine dönen simge gösterilir ve buton basılamaz
  loading?: boolean;
  // true ise buton soluk görünür ve basılamaz
  disabled?: boolean;
  // Sayfaya özel ekstra stil (ör. { marginTop: 8 } veya { alignSelf: 'flex-start' })
  style?: StyleProp<ViewStyle>;
};

// Her türün zemin, yazı ve çerçeve rengi (theme.ts'teki renk adları)
const variantColors: Record<Variant, { bg: keyof ThemeColors | 'transparent'; fg: keyof ThemeColors; border?: keyof ThemeColors }> = {
  primary: { bg: 'primary', fg: 'onPrimary' },
  secondary: { bg: 'primarySoft', fg: 'primary' },
  outline: { bg: 'transparent', fg: 'primary', border: 'border' },
  ghost: { bg: 'transparent', fg: 'primary' },
  danger: { bg: 'danger', fg: 'onPrimary' },
};

// Uygulamanın butonu (tema renginde, köşeleri yuvarlak, basınca hafifçe küçülür)
export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const theme = useTheme();
  const colors = variantColors[variant];
  // Yüklenirken de basılamasın; böylece örneğin form iki kez gönderilemez
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      // style bir fonksiyon: Pressable basılı olup olmadığını (pressed) verir, ona göre görünüm değişir
      style={({ pressed }) => [
        styles.button,
        styles[size],
        {
          backgroundColor: colors.bg === 'transparent' ? 'transparent' : theme[colors.bg],
          borderColor: colors.border ? theme[colors.border] : 'transparent',
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
        },
        // Dışarıdan verilen stil en sonda, gerekirse yukarıdakileri ezer
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={theme[colors.fg]} />
      ) : (
        <AppText variant={size === 'sm' ? 'label' : 'bodyStrong'} color={colors.fg}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: Radius.md,
    // İçeriği (yazı veya simge) iki eksende ortala
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: { minHeight: 36, paddingHorizontal: Spacing.md },
  md: { minHeight: 48, paddingHorizontal: Spacing.lg },
  lg: { minHeight: 56, paddingHorizontal: Spacing.lg },
});
