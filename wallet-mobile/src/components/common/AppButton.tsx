import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

import { AppText } from './AppText';

type AppButtonProps = {
  // Buton üzerindeki yazı
  title: string;
  // Basılınca çağrılacak fonksiyon
  onPress: () => void;
  // true ise yazının yerine dönen simge gösterilir ve buton basılamaz
  loading?: boolean;
  // true ise buton soluk görünür ve basılamaz
  disabled?: boolean;
};

// Uygulamanın ana butonu (tema renginde, köşeleri yuvarlak)
export function AppButton({ title, onPress, loading = false, disabled = false }: AppButtonProps) {
  const theme = useTheme();
  // Yüklenirken de basılamasın; böylece örneğin form iki kez gönderilemez
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      // style bir fonksiyon: Pressable basılı olup olmadığını (pressed) verir, ona göre saydamlık değişir
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary, opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}>
      {loading ? (
        <ActivityIndicator color={theme.onPrimary} />
      ) : (
        <AppText color="onPrimary" style={styles.title}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    // İçeriği (yazı veya simge) yatayda ortala
    alignItems: 'center',
  },
  title: { fontWeight: '600' },
});
