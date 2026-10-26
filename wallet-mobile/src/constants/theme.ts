// Tasarımın tek kaynağı: renkler, boşluklar, köşe yuvarlaklıkları, yazı stilleri ve gölgeler.
// Bileşenlerde doğrudan sayı veya renk kodu yazmak yerine buradaki adlar kullanılır; böylece görünüm her yerde tutarlı olur.
// Uygulamanın görünümünü değiştirmek için çoğu zaman sadece bu dosyayı düzenlemek yeterlidir.

// Açık ve karanlık tema renkleri. Bileşenler bunları useTheme() üzerinden alır.
export const Colors = {
  light: {
    // Ana renk (butonlar, seçili öğeler, aktif sekme)
    primary: '#4F46E5',
    // Ana rengin çok açık tonu (ikincil buton, seçili çip zemini, rozet)
    primarySoft: '#EEF0FF',
    // Ana rengin üstündeki yazı (buton yazısı)
    onPrimary: '#FFFFFF',
    // Normal yazı
    text: '#0F172A',
    // İkincil yazı (açıklamalar, placeholder, etiketler)
    textSecondary: '#64748B',
    // Sayfa arka planı (hafif gri; beyaz kartlar üstünde öne çıkar)
    background: '#F5F6FA',
    // Kart, giriş kutusu ve sekme çubuğu zemini
    surface: '#FFFFFF',
    // Yüzeyin bir ton koyusu (segment arka planı, seçili olmayan çip)
    surfaceMuted: '#ECEEF4',
    // Çerçeveler ve ayırıcı çizgiler
    border: '#E2E5EE',
    // Hata ve harcama tutarı (kırmızı)
    danger: '#E5484D',
    // Kırmızının açık tonu (hata kutusu zemini)
    dangerSoft: '#FDECEC',
    // Gelir, başarı mesajı (yeşil)
    success: '#16A34A',
    successSoft: '#E7F7EC',
    // Uyarı (turuncu)
    warning: '#D97706',
    warningSoft: '#FDF3E1',
  },
  dark: {
    primary: '#6366F1',
    primarySoft: '#23244A',
    onPrimary: '#FFFFFF',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0B0D12',
    surface: '#151821',
    surfaceMuted: '#1E2230',
    border: '#262B38',
    danger: '#FF6369',
    dangerSoft: '#3A1D20',
    success: '#4ADE80',
    successSoft: '#14301F',
    warning: '#FBBF24',
    warningSoft: '#3A2E12',
  },
  // as const: değerler salt okunur olur ve TypeScript tam değerleri tip olarak bilir
} as const;

// Renk setinin tipi; ör. AppText'in color özelliği sadece bu adları ('primary', 'danger'...) kabul eder
export type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

// Boşluklar (piksel): padding, margin ve gap için
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Köşe yuvarlaklıkları (piksel). full: tamamen yuvarlak (çip, rozet, avatar)
export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

// Yazı boyutları (piksel)
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 34,
} as const;

// Yazı stilleri: boyut, satır yüksekliği, kalınlık ve harf aralığı birlikte tanımlanır.
// AppText'in variant özelliği bunlardan birini seçer.
export const Typography = {
  // Büyük rakamlar, özet ekranındaki toplam tutar gibi
  display: { fontSize: FontSize.xxl, lineHeight: 41, fontWeight: '800', letterSpacing: -0.6 },
  // Sayfa başlığı
  title: { fontSize: FontSize.xl, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
  // Bölüm başlığı
  subtitle: { fontSize: FontSize.lg, lineHeight: 26, fontWeight: '600', letterSpacing: -0.2 },
  // Normal metin
  body: { fontSize: FontSize.md, lineHeight: 22, fontWeight: '400' },
  // Kalın normal metin (kart başlığı, tutar)
  bodyStrong: { fontSize: FontSize.md, lineHeight: 22, fontWeight: '600' },
  // Form etiketi, buton yazısı
  label: { fontSize: FontSize.sm, lineHeight: 18, fontWeight: '600' },
  // Küçük açıklama
  caption: { fontSize: FontSize.sm, lineHeight: 18, fontWeight: '400' },
  // En küçük yazı (rozet, zaman bilgisi)
  overline: { fontSize: FontSize.xs, lineHeight: 16, fontWeight: '600', letterSpacing: 0.4 },
} as const;

export type TypographyVariant = keyof typeof Typography;

// Gölgeler (boxShadow; iOS, Android ve web'de aynı çalışır).
// Karanlık temada gölge zaten görünmez; orada kartları çerçeve ayırır.
export const Shadows = {
  // Kartlar için çok hafif gölge
  sm: '0px 1px 2px rgba(15, 23, 42, 0.04), 0px 2px 8px rgba(15, 23, 42, 0.05)',
  // Öne çıkan öğeler (yüzen buton, açılır pencere) için
  md: '0px 4px 12px rgba(15, 23, 42, 0.08), 0px 12px 32px rgba(15, 23, 42, 0.08)',
} as const;
