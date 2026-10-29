import { SymbolView } from 'expo-symbols';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, Screen } from '@/components/common';
import { Radius, Shadows, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

type AuthScreenProps = {
  // Logonun altındaki büyük başlık, ör. "Tekrar hoş geldin"
  title: string;
  // Başlığın altındaki açıklama
  subtitle: string;
  // Form kartı ve alt bağlantılar
  children: ReactNode;
};

// Giriş ve kayıt ekranlarının ortak iskeleti: arka plandaki süs daireleri, logo, başlık ve klavye davranışı.
// Bu ekranlarda başlık çubuğu olmadığı için içerik sistem alanının (saat, çentik) altından başlar.
export function AuthScreen({ title, subtitle, children }: AuthScreenProps) {
  const theme = useTheme();
  // Ekranın üstündeki sistem alanının yüksekliği
  const insets = useSafeAreaInsets();

  return (
    // Klavye açılınca alanların klavyenin altında kalmasını önler (iOS'ta gerekli, Android kendisi hallediyor)
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll style={[styles.content, { paddingTop: insets.top + Spacing.xl }]}>
        {/* Arka plandaki iki yumuşak daire; sadece süs, ekran okuyucular görmez */}
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={StyleSheet.absoluteFill}>
          <View style={[styles.blob, styles.blobTop, { backgroundColor: theme.primarySoft }]} />
          <View style={[styles.blob, styles.blobSide, { backgroundColor: theme.primarySoft }]} />
        </View>

        {/* Logo ve karşılama yazısı */}
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <SymbolView
              name={{ ios: 'creditcard.fill', android: 'account_balance_wallet', web: 'account_balance_wallet' }}
              size={32}
              tintColor={theme.onPrimary}
            />
          </View>
          <AppText variant="title" style={styles.centerText}>
            {title}
          </AppText>
          <AppText color="textSecondary" style={styles.centerText}>
            {subtitle}
          </AppText>
        </View>

        {children}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // İçerik dikeyde ortalanır; bölümler arasında 32 piksel boşluk
  content: { justifyContent: 'center', gap: Spacing.xl, paddingBottom: Spacing.xl },
  header: { alignItems: 'center', gap: Spacing.sm },
  // Yuvarlak köşeli kare logo, hafif gölgeli
  logo: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    boxShadow: Shadows.md,
  },
  centerText: { textAlign: 'center' },
  // Süs daireleri: tam yuvarlak, kısmen ekranın dışına taşar
  blob: { position: 'absolute', borderRadius: Radius.full },
  blobTop: { width: 320, height: 320, top: -140, right: -120 },
  blobSide: { width: 220, height: 220, top: 160, left: -140, opacity: 0.6 },
});
