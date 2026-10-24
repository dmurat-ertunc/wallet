// Tasarımın tek kaynağı: renkler, boşluklar, köşe yuvarlaklıkları ve yazı boyutları.
// Bileşenlerde doğrudan sayı veya renk kodu yazmak yerine buradaki adlar kullanılır; böylece görünüm her yerde tutarlı olur.

// Açık ve karanlık tema renkleri. Bileşenler bunları useTheme() üzerinden alır.
export const Colors = {
  light: {
    // Ana renk (butonlar, seçili öğeler)
    primary: '#208AEF',
    // Normal yazı
    text: '#11181C',
    // İkincil yazı (açıklamalar, placeholder)
    textSecondary: '#60646C',
    // Sayfa arka planı
    background: '#FFFFFF',
    // Kart ve giriş kutusu zemini
    surface: '#F0F0F3',
    // Çerçeveler
    border: '#E0E1E6',
    // Hata ve harcama tutarı (kırmızı)
    danger: '#E5484D',
    // Ana rengin üstündeki yazı (buton yazısı)
    onPrimary: '#FFFFFF',
  },
  dark: {
    primary: '#3B9EFF',
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    background: '#000000',
    surface: '#212225',
    border: '#2E3135',
    danger: '#FF6369',
    onPrimary: '#FFFFFF',
  },
  // as const: değerler salt okunur olur ve TypeScript tam değerleri tip olarak bilir
} as const;

// Renk setinin tipi; ör. AppText'in color özelliği sadece bu adları ('primary', 'danger'...) kabul eder
export type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

// Boşluklar (piksel): padding, margin ve gap için
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// Köşe yuvarlaklıkları (piksel)
export const Radius = {
  sm: 6,
  md: 12,
  lg: 20,
} as const;

// Yazı boyutları (piksel)
export const FontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
} as const;
