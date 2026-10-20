import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common';
import { CategoryLabels, Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';
import { Expense } from '@/models';
import { formatCurrency, formatDate } from '@/utils';

export function ExpenseCard({ expense }: { expense: Expense }) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      <View style={styles.info}>
        <AppText style={styles.title}>{expense.title}</AppText>
        <AppText variant="caption" color="textSecondary">
          {CategoryLabels[expense.category]} · {formatDate(expense.expenseDate)}
        </AppText>
      </View>
      <AppText style={styles.title} color="danger">
        -{formatCurrency(expense.amount, expense.currency)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  info: { flex: 1, gap: Spacing.xs },
  title: { fontWeight: '600' },
});
