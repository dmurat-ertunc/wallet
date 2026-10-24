import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen } from '@/components/common';
import { SwipeableExpenseCard } from '@/components/expense';
import { Spacing } from '@/constants';
import { useExpenses } from '@/hooks';

// Harcamalar sekmesi: backend'den gelen harcamaları liste halinde gösterir.
// Veriyi kendisi çekmez; useExpenses hook'unun döndürdüğü değerlere göre ne çizeceğine karar verir.
export function ExpenseListPage() {
  // expenses: liste, loading: istek sürüyor mu, error: hata mesajı, refresh: listeyi yeniden çek
  const { expenses, loading, error, refresh } = useExpenses();

  // İlk yükleme: henüz hiç veri yokken ortada dönen bir yükleniyor simgesi göster
  if (loading && expenses.length === 0) {
    return (
      <Screen>
        <ActivityIndicator style={styles.center} />
      </Screen>
    );
  }

  return (
    <Screen>
      {error ? (
        // Hata varsa mesaj ve "Tekrar dene" butonu göster
        <View style={styles.center}>
          <AppText color="danger">{error}</AppText>
          <AppButton title="Tekrar dene" onPress={refresh} />
        </View>
      ) : (
        // FlatList sadece ekranda görünen satırları çizer, bu yüzden uzun listelerde de hızlıdır
        <FlatList
          data={expenses}
          // Her satır için benzersiz anahtar; React hangi satırın değiştiğini bununla anlar
          keyExtractor={(item) => String(item.id)}
          // Her satır sola kaydırılınca Düzenle / Sil butonlarını gösterir
          renderItem={({ item }) => <SwipeableExpenseCard expense={item} />}
          contentContainerStyle={styles.list}
          // Listeyi aşağı çekince yenileme (pull to refresh)
          refreshing={loading}
          onRefresh={refresh}
          // Liste boşsa gösterilecek içerik
          ListEmptyComponent={
            <AppText color="textSecondary" style={styles.empty}>
              Henüz harcama yok
            </AppText>
          }
        />
      )}
      {/* Yeni Harcama modalını açar (app/expenses/new.tsx) */}
      <AppButton title="Harcama ekle" onPress={() => router.push('/expenses/new')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Yükleniyor ve hata durumlarında içeriği ekranın ortasına yerleştirir
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  // Kartlar arasında boşluk ve listenin altında butona yer
  list: { gap: Spacing.sm, paddingBottom: Spacing.md },
  empty: { textAlign: 'center', marginTop: Spacing.xl },
});
