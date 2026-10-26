import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants';
import { useTheme } from '@/hooks';

type ScreenProps = {
  children?: ReactNode;
  // true ise içerik kaydırılabilir olur (uzun sayfalar için). Liste sayfalarında FlatList kullanıldığı için gerekmez.
  scroll?: boolean;
  // false ise kenar boşluğu verilmez (ör. kenardan kenara resim veya harita gösterilecekse)
  padded?: boolean;
  // Sayfaya özel ekstra stil; içeriği saran kutuya uygulanır (ör. { gap: 12 } veya { justifyContent: 'center' })
  style?: StyleProp<ViewStyle>;
};

// Her sayfanın dış çerçevesi: güvenli alan (safe area), temaya göre arka plan rengi ve iç boşluk.
// children isteğe bağlı olduğu için <Screen /> boş bir sayfa olarak da kullanılabilir.
export function Screen({ children, scroll = false, padded = true, style }: ScreenProps) {
  const theme = useTheme();
  // İçerik kutusunun stili; sırası önemli: önce varsayılanlar, en son dışarıdan gelen style
  const contentStyle = [styles.content, padded && styles.padded, style];

  return (
    // edges={['bottom']}: sadece alttaki sistem çubuğunun (ör. iPhone'daki çizgi) altına içerik girmesini engeller.
    // Üst kısım için gerek yok, çünkü başlık çubuğu orayı zaten kaplıyor.
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      {scroll ? (
        // keyboardShouldPersistTaps="handled": klavye açıkken bir butona ilk dokunuşta tıklama çalışsın
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Ekranın tamamını kapla
  container: { flex: 1 },
  // Kaydırılan içerik en az ekran kadar uzun olsun (içerik azken ortalama yapılabilsin)
  scrollContent: { flexGrow: 1 },
  // Öğeler arasında varsayılan boşluk
  content: { gap: Spacing.md },
  // Kenarlardan 16 piksel boşluk
  padded: { padding: Spacing.md },
});
