import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/common';
import { CategoryLabels, Spacing } from '@/constants';
import { Expense } from '@/models';
import { formatCurrency, formatDate } from '@/utils';

// Harcama listesindeki tek bir satır (kart).
// Solda başlık ve "Kategori · Tarih", sağda kırmızı renkte eksi tutar gösterilir.
export function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <AppText variant="bodyStrong">{expense.title}</AppText>
        {/* Örnek: "Market · 24.10.2026"; enum değeri (GROCERIES) Türkçe etikete çevrilir */}
        <AppText variant="caption" color="textSecondary">
          {CategoryLabels[expense.category]} · {formatDate(expense.expenseDate)}
        </AppText>
      </View>
      {/* Örnek: "-₺450,50" */}
      <AppText variant="bodyStrong" color="danger">
        -{formatCurrency(expense.amount, expense.currency)}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Yatay dizilim: solda bilgiler, sağda tutar
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  // flex: 1 → bilgi kısmı kalan genişliği kaplar, tutar sağa itilir
  info: { flex: 1, gap: Spacing.xxs },
});
