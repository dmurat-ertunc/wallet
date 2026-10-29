import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

// Başlık çubuğunun sağ üst köşesindeki "Çıkış" butonu.
// Tek tek sayfalara değil, gezinme ayarlarına (headerRight) eklenir; böylece başlığı olan her sayfada görünür.
// Şimdilik oturum olmadığı için sadece giriş ekranına döner; login eklendiğinde burada oturum da kapatılacak.
export function LogoutButton() {
  const theme = useTheme();

  function logout() {
    // Üstte açık bir modal varsa (ör. Yeni Harcama) önce kapat; böylece geçmişte hiçbir ekran kalmaz
    if (router.canDismiss()) {
      router.dismissAll();
    }
    // replace: giriş ekranında geri tuşu uygulamanın içine dönmez
    router.replace('/login');
  }

  return (
    <Pressable
      onPress={logout}
      accessibilityRole="button"
      accessibilityLabel="Çıkış yap"
      hitSlop={8}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.dangerSoft, opacity: pressed ? 0.7 : 1 }]}>
      <SymbolView
        name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
        size={16}
        tintColor={theme.danger}
      />
      <AppText variant="label" color="danger">
        Çıkış
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Kırmızımsı zeminli küçük hap şeklinde buton: ikon solda, yazı sağda
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm + Spacing.xs,
    paddingVertical: Spacing.xs + Spacing.xxs,
    borderRadius: Radius.full,
  },
});
