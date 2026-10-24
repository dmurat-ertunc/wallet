import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common';
import { CategoryLabels, Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';
import { Expense } from '@/models';
import { formatCurrency, formatDate } from '@/utils';

// Harcama listesindeki tek bir satır (kart).
// Solda başlık ve "Kategori · Tarih", sağda kırmızı renkte eksi tutar gösterilir.
export function ExpenseCard({ expense }: { expense: Expense }) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.info}>
        <AppText style={styles.title}>{expense.title}</AppText>
        {/* Örnek: "Market · 24.10.2026"; enum değeri (GROCERIES) Türkçe etikete çevrilir */}
        <AppText variant="caption" color="textSecondary">
          {CategoryLabels[expense.category]} · {formatDate(expense.expenseDate)}
        </AppText>
      </View>
      {/* Örnek: "-₺450,50" */}
      <AppText style={styles.title} color="danger">
        -{formatCurrency(expense.amount, expense.currency)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  // Yatay dizilim: solda bilgiler, sağda tutar
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  // flex: 1 → bilgi kısmı kalan genişliği kaplar, tutar sağa itilir
  info: { flex: 1, gap: Spacing.xs },
  title: { fontWeight: '600' },
});
