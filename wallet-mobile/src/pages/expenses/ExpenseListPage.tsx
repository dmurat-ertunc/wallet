import { router } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen } from '@/components/common';
import { ExpenseCard } from '@/components/expense';
import { Spacing } from '@/constants';
import { useExpenses } from '@/hooks';

export function ExpenseListPage() {
  const { expenses, loading, error, refresh } = useExpenses();

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
        <View style={styles.center}>
          <AppText color="danger">{error}</AppText>
          <AppButton title="Tekrar dene" onPress={refresh} />
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ExpenseCard expense={item} />}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={refresh}
          ListEmptyComponent={
            <AppText color="textSecondary" style={styles.empty}>
              Henüz harcama yok
            </AppText>
          }
        />
      )}
      <AppButton title="Harcama ekle" onPress={() => router.push('/expenses/new')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.md },
  list: { gap: Spacing.sm, paddingBottom: Spacing.md },
  empty: { textAlign: 'center', marginTop: Spacing.xl },
});
