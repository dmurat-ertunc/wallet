import { StyleSheet } from 'react-native';

import { AppText, Screen } from '@/components/common';

// Placeholder: the add-expense form will be built here
export function ExpenseFormPage() {
  return (
    <Screen>
      <AppText color="textSecondary" style={styles.text}>
        Harcama ekleme formu burada olacak
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: { textAlign: 'center' },
});
