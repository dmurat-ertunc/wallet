import { Tabs } from 'expo-router';
import { DrawerToggleButton } from 'expo-router/drawer';
import { SymbolView } from 'expo-symbols';

import { useTheme } from '@/hooks';

// Ekranın altındaki sekme çubuğu (bottom tabs).
// Her sekmenin başlığının solundaki ☰ butonu, bir üst katmandaki (drawer) yan menüyü açar.
export default function TabsLayout() {
  // Sekme ve ikon renklerini temaya göre almak için
  const theme = useTheme();

  return (
    <Tabs
      // screenOptions: tüm sekmelere uygulanan ortak ayarlar
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        // Sekme çubuğu kart renginde, üstünde ince bir çizgi
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
        tabBarLabelStyle: { fontWeight: '600' },
        // Başlık çubuğu alt çizgisiz ve kalın yazılı (kök Stack ile aynı görünüm)
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        // Başlığın sol tarafına yan menüyü açan butonu koyar
        headerLeft: () => <DrawerToggleButton tintColor={theme.text} accessibilityLabel="Menüyü aç" />,
      }}>
      {/* Yeni sekme eklemek için (tabs) klasörüne dosya açıp buraya Tabs.Screen yazılır */}
      <Tabs.Screen
        // index.tsx → uygulama açılınca ilk görünen sekme (adres: /)
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <SymbolView name={{ ios: 'house.fill', android: 'home', web: 'home' }} size={size} tintColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        // expenses.tsx → harcama listesi (adres: /expenses)
        name="expenses"
        options={{
          title: 'Harcamalar',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'list.bullet.rectangle', android: 'receipt_long', web: 'receipt_long' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
