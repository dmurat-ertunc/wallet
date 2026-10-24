import { useColorScheme } from 'react-native';

import { Colors } from '@/constants';

// Telefonun açık/karanlık mod ayarına göre doğru renk setini döndürür.
// Bileşenler renklerini her zaman buradan alır; böylece karanlık moda otomatik uyum sağlarlar.
export function useTheme() {
  // 'light', 'dark' veya null (bilinmiyorsa açık tema kullanılır)
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}
