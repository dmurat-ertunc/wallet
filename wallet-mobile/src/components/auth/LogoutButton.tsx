import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useAuth } from '@/context';
import { useTheme } from '@/hooks';

// Başlık çubuğunun sağ üst köşesindeki "Çıkış" butonu.
// Tek tek sayfalara değil, gezinme ayarlarına (headerRight) eklenir; böylece başlığı olan her sayfada görünür.
// Sadece token'ı siler; yönlendirme yapmaz. Token gidince kök layout'taki Stack.Protected korumalı ekranları
// (açık modallar dahil) geçmişten siler ve kullanıcıyı giriş ekranına gönderir, geri tuşu da içeri dönemez.
export function LogoutButton() {
  const theme = useTheme();
  const { signOut } = useAuth();

  return (
    <Pressable
      onPress={signOut}
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
