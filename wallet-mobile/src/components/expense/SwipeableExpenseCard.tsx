import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { AppText } from '@/components/common';
import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';
import { Expense } from '@/models';

import { ExpenseCard } from './ExpenseCard';

type SwipeableExpenseCardProps = {
  expense: Expense;
  // Sil'e basınca çağrılır; silindiyse true, silinemediyse false döner
  onDelete: () => Promise<boolean>;
};

// Sola kaydırılınca sağ tarafta "Düzenle" ve "Sil" butonlarını gösteren harcama kartı.
// Sil harcamayı siler; Düzenle şimdilik sadece satırı geri kapatır, düzenleme ileride buraya bağlanacak.
export function SwipeableExpenseCard({ expense, onDelete }: SwipeableExpenseCardProps) {
  const theme = useTheme();
  // Silme isteği sürüyor mu; true iken Sil butonunda dönen simge görünür ve butonlara basılamaz
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(swipeable: SwipeableMethods) {
    setDeleting(true);
    const deleted = await onDelete();
    // Başarılıysa kart listeden kalkar, yapacak bir şey yok.
    // Başarısızsa butonu eski haline getir ve satırı kapat; hata mesajı listenin üstünde gösterilir.
    if (!deleted) {
      setDeleting(false);
      swipeable.close();
    }
  }

  // Sağda açılan butonlar. swipeable: satırı kodla kapatmak gibi işlemler için kütüphanenin verdiği metotlar
  function renderRightActions(_progress: unknown, _translation: unknown, swipeable: SwipeableMethods) {
    return (
      <View style={styles.actions}>
        <Pressable
          onPress={() => swipeable.close()}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel="Düzenle"
          style={[styles.action, { backgroundColor: theme.primary, opacity: deleting ? 0.5 : 1 }]}>
          <SymbolView name={{ ios: 'pencil', android: 'edit', web: 'edit' }} size={20} tintColor={theme.onPrimary} />
          <AppText variant="caption" color="onPrimary">
            Düzenle
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => handleDelete(swipeable)}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel="Sil"
          style={[styles.action, { backgroundColor: theme.danger }]}>
          {deleting ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={20}
                tintColor={theme.onPrimary}
              />
              <AppText variant="caption" color="onPrimary">
                Sil
              </AppText>
            </>
          )}
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
