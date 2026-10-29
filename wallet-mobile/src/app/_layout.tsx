import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { LogoutButton } from '@/components/auth';
import { AuthProvider, useAuth } from '@/context';
import { useNavigationTheme, useTheme } from '@/hooks';

// Açılış ekranı (splash) kendiliğinden kapanmasın; kayıtlı token okunana kadar açık kalacak.
// Aksi halde giriş yapmış kullanıcı bir an login ekranını görürdü.
SplashScreen.preventAutoHideAsync();

// Kök gezinme yapısı (root layout). Uygulama açılınca ilk çalışan dosya budur.
// src/app içindeki dosyalar sadece rota tanımıdır; ekranların asıl kodu src/pages içindedir.
// AuthProvider oturum bilgisini tüm ekranlara dağıtır; RootNavigator hangi ekranların açılabileceğine buna göre karar verir.
export default function RootLayout() {
  // Başlık çubuğu, arka plan gibi gezinme renkleri theme.ts'ten üretilir
  const navigationTheme = useNavigationTheme();
  const theme = useTheme();

  return (
    // GestureHandlerRootView: kaydırma hareketlerinin (listede sola kaydırma, yan menü) çalışması için en dışta olmalı
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.background }]}>
      {/* ThemeProvider gezinme renklerini tüm ekranlara dağıtır */}
      <ThemeProvider value={navigationTheme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// useAuth sadece AuthProvider'ın içinde çalıştığı için Stack ayrı bir bileşende
function RootNavigator() {
  const theme = useTheme();
  const { token, isLoading } = useAuth();
  const signedIn = token !== null;

  // Token okununca splash kapanır
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  // Token okunana kadar hiçbir ekran çizilmez (splash zaten önde duruyor)
  if (isLoading) {
    return null;
  }

  return (
    <Stack
      // Tüm Stack ekranlarına uygulanan ortak başlık görünümü: alt çizgisiz, kalın başlık
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: styles.headerTitle,
        contentStyle: { backgroundColor: theme.background },
        // Başlığı görünen her Stack ekranında (ör. Yeni Harcama) sağ üstte çıkış butonu.
        // Başlığı gizli olan ekranlarda (login, sekmeler) bu ayar etkisizdir; sekmeler kendi başlıklarında gösterir.
        headerRight: () => <LogoutButton />,
      }}>
      {/* index: açılışta kullanıcıyı oturuma göre /home veya /login'e gönderen boş rota; korumasızdır */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Sadece oturum yokken açılabilir. Giriş veya kayıt başarılı olunca bu ekranlar kapanır
          ve kullanıcı index üzerinden /home'a gider */}
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Sadece oturum varken açılabilir. Çıkış yapılınca (veya token geçersizleşince) bu ekranlar geçmişten silinir
          ve kullanıcı index üzerinden /login'e gider */}
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="expenses/new" options={{ title: 'Yeni Harcama', presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  // Ekranın tamamını kaplamazsa içindeki her şey sıfır yükseklikte kalır
  root: { flex: 1 },
  headerTitle: { fontWeight: '700' },
});
