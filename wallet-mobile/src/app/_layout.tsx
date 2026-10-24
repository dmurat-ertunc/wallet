import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Kök gezinme yapısı (root layout). Uygulama açılınca ilk çalışan dosya budur.
// src/app içindeki dosyalar sadece rota tanımıdır; ekranların asıl kodu src/pages içindedir.
// (drawer) grubu yan menüyü ve onun içindeki alt sekmeleri tutar; modallar ikisinin de üstünde açılır.
export default function RootLayout() {
  // Telefonun açık/karanlık mod ayarı: 'light', 'dark' veya null
  const colorScheme = useColorScheme();

  return (
    // GestureHandlerRootView: kaydırma hareketlerinin (listede sola kaydırma, yan menü) çalışması için en dışta olmalı
    <GestureHandlerRootView style={styles.root}>
      {/* ThemeProvider başlık çubuğu, arka plan gibi gezinme renklerini moda göre ayarlar */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
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
});
