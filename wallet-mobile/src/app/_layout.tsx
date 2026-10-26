import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useNavigationTheme, useTheme } from '@/hooks';

// Kök gezinme yapısı (root layout). Uygulama açılınca ilk çalışan dosya budur.
// src/app içindeki dosyalar sadece rota tanımıdır; ekranların asıl kodu src/pages içindedir.
// (drawer) grubu yan menüyü ve onun içindeki alt sekmeleri tutar; modallar ikisinin de üstünde açılır.
export default function RootLayout() {
  // Başlık çubuğu, arka plan gibi gezinme renkleri theme.ts'ten üretilir
  const navigationTheme = useNavigationTheme();
  const theme = useTheme();

  return (
    // GestureHandlerRootView: kaydırma hareketlerinin (listede sola kaydırma, yan menü) çalışması için en dışta olmalı
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ThemeProvider gezinme renklerini tüm ekranlara dağıtır */}
      <ThemeProvider value={navigationTheme}>
        <Stack
          // Tüm Stack ekranlarına uygulanan ortak başlık görünümü: alt çizgisiz, kalın başlık
          screenOptions={{
            headerShadowVisible: false,
            headerTitleStyle: styles.headerTitle,
            contentStyle: { backgroundColor: theme.background },
          }}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="expenses/new" options={{ title: 'Yeni Harcama', presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Ekranın tamamını kaplamazsa içindeki her şey sıfır yükseklikte kalır
  root: { flex: 1 },
  headerTitle: { fontWeight: '700' },
});
