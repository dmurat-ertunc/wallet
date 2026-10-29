import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthScreen, PasswordToggle } from '@/components/auth';
import { AppButton, AppInput, AppText, Card } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useLoginForm } from '@/hooks';

// Giriş ekranı. Oturum yoksa uygulama açılınca ilk bu ekran gelir.
// Kullanıcı adı ve şifre useLoginForm üzerinden backend'e (POST /api/auth/login) gönderilir.
// Giriş başarılı olunca burada yönlendirme yapılmaz; kök layout'taki Stack.Protected kullanıcıyı ana sayfaya geçirir.
export function LoginPage() {
  const form = useLoginForm();
  // Şifre alanında yazılanlar görünsün mü; göz ikonuyla değişir
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthScreen title="Tekrar hoş geldin" subtitle="Harcamalarını takip etmek için hesabına giriş yap">
      {/* Giriş formu */}
      <Card style={styles.form}>
        <AppInput
          label="Kullanıcı adı"
          placeholder="kullanici_adi"
          value={form.userName}
          onChangeText={form.setUserName}
          error={form.errors.userName}
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
          value={form.password}
          onChangeText={form.setPassword}
          error={form.errors.password}
          // Klavyedeki "Bitti" tuşu da giriş yapar
          onSubmitEditing={form.submit}
          // true iken yazılanlar nokta olarak görünür
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          trailing={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />}
        />

        {/* Şimdilik bir şey yapmaz; şifre sıfırlama ekranı eklenince bağlanacak */}
        <Pressable accessibilityRole="link" style={styles.forgot} hitSlop={8}>
          <AppText variant="label" color="primary">
            Şifremi unuttum
          </AppText>
        </Pressable>

        {/* Yanlış şifre veya bağlantı hatası */}
        {form.submitError ? (
          <AppText variant="caption" color="danger" accessibilityRole="alert" style={styles.centerText}>
            {form.submitError}
          </AppText>
        ) : null}

        <AppButton title="Giriş yap" size="lg" loading={form.submitting} onPress={form.submit} />
      </Card>

      {/* Alt satır: kayıt ekranına geçiş */}
      <View style={styles.footer}>
        <AppText variant="caption" color="textSecondary">
          Hesabın yok mu?
        </AppText>
        <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.push('/register')}>
          <AppText variant="label" color="primary">
            Kayıt ol
          </AppText>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  centerText: { textAlign: 'center' },
  form: { gap: Spacing.lg, padding: Spacing.lg, borderRadius: Radius.lg },
  // "Şifremi unuttum" sağa yaslı ve şifre alanına biraz daha yakın dursun
  forgot: { alignSelf: 'flex-end', marginTop: -Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.xs },
});
