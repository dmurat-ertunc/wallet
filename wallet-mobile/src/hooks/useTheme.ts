import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants';

// Telefonun açık/karanlık mod ayarına göre doğru renk setini döndürür.
// Bileşenler renklerini her zaman buradan alır; böylece karanlık moda otomatik uyum sağlarlar.
export function useTheme() {
  // 'light', 'dark' veya null (bilinmiyorsa açık tema kullanılır)
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

// Gezinme (başlık çubuğu, sekme çubuğu, yan menü, ekran arka planı) için tema.
// Renkler theme.ts'ten gelir; böylece yeni açılan her sayfa ayrıca ayar yapmadan aynı görünümü alır.
export function useNavigationTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  // Yazı tipleri gibi diğer ayarlar kütüphanenin varsayılanından gelir
  const base = isDark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      // Başlık çubuğu sayfa arka planıyla aynı renkte; böylece ayrı bir şerit gibi durmaz
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };
}
