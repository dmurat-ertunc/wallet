import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AuthScreen, PasswordToggle } from '@/components/auth';
import { AppButton, AppInput, AppText, Card } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useRegisterForm } from '@/hooks';

// Kayıt ekranı. Giriş ekranındaki "Kayıt ol" bağlantısıyla açılır.
// Alanlar useRegisterForm üzerinden backend'e (POST /api/auth/register) gönderilir.
// Kayıt başarılı olunca backend token da döndürür; Stack.Protected kullanıcıyı doğrudan ana sayfaya geçirir.
export function RegisterPage() {
  const form = useRegisterForm();
  // Şifre ve şifre tekrarı alanları birlikte gösterilir / gizlenir
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((current) => !current);

  // Giriş ekranından gelindiyse geri dön; doğrudan bu adresle açıldıysa giriş ekranına geç
  function goToLogin() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  }

  return (
    <AuthScreen title="Hesap oluştur" subtitle="Birkaç bilgiyle hemen harcamalarını takip etmeye başla">
      <Card style={styles.form}>
        {/* Ad ve soyad yan yana */}
        {/* AppInput'un style'ı içteki yazı alanına uygulandığı için genişlik saran View'larla verilir */}
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <AppInput
              label="Ad"
              placeholder="Ad"
              value={form.values.firstName}
              onChangeText={(value) => form.setField('firstName', value)}
              error={form.errors.firstName}
              autoComplete="given-name"
              textContentType="givenName"
              maxLength={50}
            />
          </View>
          <View style={styles.rowItem}>
            <AppInput
              label="Soyad"
              placeholder="Soyad"
              value={form.values.lastName}
              onChangeText={(value) => form.setField('lastName', value)}
              error={form.errors.lastName}
              autoComplete="family-name"
              textContentType="familyName"
              maxLength={50}
            />
          </View>
        </View>
        <AppInput
          label="Kullanıcı adı"
          placeholder="kullanici_adi"
          value={form.values.userName}
          onChangeText={(value) => form.setField('userName', value)}
          error={form.errors.userName}
          // Kullanıcı adında otomatik büyük harf ve düzeltme istenmez
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username-new"
          textContentType="username"
          maxLength={50}
        />
        <AppInput
          label="E-posta"
          placeholder="ornek@mail.com"
          value={form.values.email}
          onChangeText={(value) => form.setField('email', value)}
          error={form.errors.email}
          // @ işaretli klavye açılır
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          maxLength={100}
        />
        <AppInput
          label="Şifre"
          placeholder="En az 6 karakter"
          value={form.values.password}
          onChangeText={(value) => form.setField('password', value)}
          error={form.errors.password}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          // "new-password": telefon kayıtlı şifreyi önermek yerine güçlü yeni bir şifre önerebilir
          autoComplete="new-password"
          textContentType="newPassword"
          maxLength={100}
          trailing={<PasswordToggle visible={showPassword} onToggle={togglePassword} />}
        />
        <AppInput
          label="Şifre tekrar"
          placeholder="Şifreni tekrar yaz"
          value={form.values.passwordConfirm}
          onChangeText={(value) => form.setField('passwordConfirm', value)}
          error={form.errors.passwordConfirm}
          // Klavyedeki "Bitti" tuşu da kaydı gönderir
          onSubmitEditing={form.submit}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          maxLength={100}
          trailing={<PasswordToggle visible={showPassword} onToggle={togglePassword} />}
        />

        {/* Bir alana ait olmayan hatalar (ör. sunucuya bağlanılamadı) */}
        {form.submitError ? (
          <AppText variant="caption" color="danger" accessibilityRole="alert" style={styles.centerText}>
            {form.submitError}
          </AppText>
        ) : null}

        <AppButton title="Kayıt ol" size="lg" loading={form.submitting} onPress={form.submit} />
      </Card>

      {/* Alt satır: giriş ekranına dönüş */}
      <View style={styles.footer}>
        <AppText variant="caption" color="textSecondary">
          Zaten hesabın var mı?
        </AppText>
        <Pressable accessibilityRole="link" hitSlop={8} onPress={goToLogin}>
          <AppText variant="label" color="primary">
            Giriş yap
          </AppText>
        </Pressable>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  centerText: { textAlign: 'center' },
  form: { gap: Spacing.lg, padding: Spacing.lg, borderRadius: Radius.lg },
  // Ad ve soyad alanları eşit genişlikte yan yana
  row: { flexDirection: 'row', gap: Spacing.md },
  // flex: 1 → iki alan kalan genişliği eşit paylaşır; minWidth: 0 → uzun yazı kutuyu taşırmaz
  rowItem: { flex: 1, minWidth: 0 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.xs },
});
