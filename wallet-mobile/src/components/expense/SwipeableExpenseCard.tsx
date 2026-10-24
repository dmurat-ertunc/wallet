import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { AppText } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';
import { Expense } from '@/models';

import { ExpenseCard } from './ExpenseCard';

// Sola kaydırılınca sağ tarafta "Düzenle" ve "Sil" butonlarını gösteren harcama kartı.
// Şimdilik butonlar sadece satırı geri kapatır; düzenleme ve silme işlemleri ileride buraya bağlanacak.
export function SwipeableExpenseCard({ expense }: { expense: Expense }) {
  const theme = useTheme();

  // Sağda açılan butonlar. swipeable: satırı kodla kapatmak gibi işlemler için kütüphanenin verdiği metotlar
  function renderRightActions(_progress: unknown, _translation: unknown, swipeable: SwipeableMethods) {
    return (
      <View style={styles.actions}>
        <Pressable
          onPress={() => swipeable.close()}
          accessibilityRole="button"
          accessibilityLabel="Düzenle"
          style={[styles.action, { backgroundColor: theme.primary }]}>
          <SymbolView name={{ ios: 'pencil', android: 'edit', web: 'edit' }} size={20} tintColor={theme.onPrimary} />
          <AppText variant="caption" color="onPrimary">
            Düzenle
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => swipeable.close()}
          accessibilityRole="button"
          accessibilityLabel="Sil"
          style={[styles.action, { backgroundColor: theme.danger }]}>
          <SymbolView name={{ ios: 'trash', android: 'delete', web: 'delete' }} size={20} tintColor={theme.onPrimary} />
          <AppText variant="caption" color="onPrimary">
            Sil
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <ReanimatedSwipeable
      renderRightActions={renderRightActions}
      // Butonların yarısından fazlası görününce bırakıldığında satır açık kalır, azsa geri kapanır
      rightThreshold={40}
      // Butonların ötesine fazladan kaydırmayı engeller
      overshootRight={false}
      // Kart köşeleri yuvarlak olduğu için kayan kısım da köşelerden taşmasın
      containerStyle={styles.container}>
      <ExpenseCard expense={expense} />
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: Radius.md },
  // Butonlar kartın sağında yan yana, kartla aralarında küçük bir boşluk
  actions: { flexDirection: 'row', gap: Spacing.xs, marginLeft: Spacing.sm },
  // Her buton kart yüksekliğinde, sabit genişlikte; ikon üstte, yazı altta
  action: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.md,
  },
});
