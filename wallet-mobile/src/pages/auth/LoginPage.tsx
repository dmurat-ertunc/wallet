import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppInput, AppText, Card, Screen } from '@/components/common';
import { Radius, Shadows, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

// Giriş ekranı. Uygulama açılınca ilk bu ekran gelir.
// Şimdilik sadece tasarım: kullanıcı adı ve şifre hiçbir yere gönderilmez, kontrol edilmez.
// "Giriş yap" doğrudan ana sayfaya geçer; login eklendiğinde buraya useLogin gibi bir hook bağlanacak.
export function LoginPage() {
  const theme = useTheme();
  // Ekranın üstündeki sistem alanının (saat, çentik) yüksekliği; bu sayfada başlık çubuğu olmadığı için içerik onun altından başlamalı
  const insets = useSafeAreaInsets();
  // Şifre alanında yazılanlar görünsün mü; göz ikonuyla değişir
  const [showPassword, setShowPassword] = useState(false);

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
            Tekrar hoş geldin
          </AppText>
          <AppText color="textSecondary" style={styles.centerText}>
            Harcamalarını takip etmek için hesabına giriş yap
          </AppText>
        </View>

        {/* Giriş formu */}
        <Card style={styles.form}>
          <AppInput
            label="Kullanıcı adı"
            placeholder="kullanici_adi"
            // Kullanıcı adında otomatik büyük harf ve düzeltme istenmez
            autoCapitalize="none"
            autoCorrect={false}
            // Telefonun kayıtlı hesap/şifre önerilerini gösterebilmesi için
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
          />
          <AppInput
            label="Şifre"
            placeholder="••••••••"
            // true iken yazılanlar nokta olarak görünür
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            // Kutunun sağındaki göz ikonu: şifreyi göster / gizle
            trailing={
              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                // İkon küçük olduğu için dokunma alanı her yönden 12 piksel büyütülür
                hitSlop={12}>
                <SymbolView
                  name={
                    showPassword
                      ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
                      : { ios: 'eye', android: 'visibility', web: 'visibility' }
                  }
                  size={20}
                  tintColor={theme.textSecondary}
                />
              </Pressable>
            }
          />

          {/* Şimdilik bir şey yapmaz; şifre sıfırlama ekranı eklenince bağlanacak */}
          <Pressable accessibilityRole="link" style={styles.forgot} hitSlop={8}>
            <AppText variant="label" color="primary">
              Şifremi unuttum
            </AppText>
          </Pressable>

          {/* replace: giriş ekranı geçmişten silinir, ana sayfada geri tuşu tekrar buraya dönmez */}
          <AppButton title="Giriş yap" size="lg" onPress={() => router.replace('/home')} />
        </Card>

        {/* Alt satır: kayıt ol bağlantısı (şimdilik bir şey yapmaz) */}
        <View style={styles.footer}>
          <AppText variant="caption" color="textSecondary">
            Hesabın yok mu?
          </AppText>
          <Pressable accessibilityRole="link" hitSlop={8}>
            <AppText variant="label" color="primary">
              Kayıt ol
            </AppText>
          </Pressable>
        </View>
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
  form: { gap: Spacing.lg, padding: Spacing.lg, borderRadius: Radius.lg },
  // "Şifremi unuttum" sağa yaslı ve şifre alanına biraz daha yakın dursun
  forgot: { alignSelf: 'flex-end', marginTop: -Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.xs },
  // Süs daireleri: tam yuvarlak, kısmen ekranın dışına taşar
  blob: { position: 'absolute', borderRadius: Radius.full },
  blobTop: { width: 320, height: 320, top: -140, right: -120 },
  blobSide: { width: 220, height: 220, top: 160, left: -140, opacity: 0.6 },
});
