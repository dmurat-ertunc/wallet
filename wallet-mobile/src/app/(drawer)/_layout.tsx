import { Drawer } from 'expo-router/drawer';
import { SymbolView } from 'expo-symbols';

import { useTheme } from '@/hooks';

// Tüm uygulamayı saran, soldan açılan yan menü (drawer).
// Menünün kendi başlığı gizli; ☰ butonu alt sekmelerin başlığında duruyor ve bu menüyü açıyor.
export default function DrawerLayout() {
  // Menü renklerini açık/karanlık temaya göre almak için
  const theme = useTheme();

  return (
    <Drawer
      // screenOptions: menüdeki tüm ekranlara uygulanan ortak ayarlar
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.text,
        drawerStyle: { backgroundColor: theme.background },
      }}>
      {/* Yeni menü öğesi eklemek için bu klasöre bir ekran dosyası açıp buraya Drawer.Screen yazılır */}
      <Drawer.Screen
        // "name" klasördeki rota adıyla aynı olmalı; (tabs) grubu alt sekmelerin tamamıdır
        name="(tabs)"
        options={{
          drawerLabel: 'Ana Sayfa',
          // iOS'ta SF Symbols, Android ve web'de Google Material Symbols ikonu çizilir
          drawerIcon: ({ color, size }) => (
            <SymbolView name={{ ios: 'house', android: 'home', web: 'home' }} size={size} tintColor={color} />
          ),
        }}
      />
    </Drawer>
  );
}
