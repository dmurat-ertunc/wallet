import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants';
import { useTheme } from '@/hooks';

// Her sayfanın dış çerçevesi: güvenli alan (safe area), temaya göre arka plan rengi ve iç boşluk.
// children isteğe bağlı olduğu için <Screen /> boş bir sayfa olarak da kullanılabilir.
export function Screen({ children }: { children?: ReactNode }) {
  const theme = useTheme();
  return (
    // edges={['bottom']}: sadece alttaki sistem çubuğunun (ör. iPhone'daki çizgi) altına içerik girmesini engeller.
    // Üst kısım için gerek yok, çünkü başlık çubuğu orayı zaten kaplıyor.
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // Ekranın tamamını kapla
    flex: 1,
    // Kenarlardan 16 piksel boşluk
    padding: Spacing.md,
  },
});
