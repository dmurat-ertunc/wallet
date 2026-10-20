import { type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants';
import { useTheme } from '@/hooks';

// Base wrapper for every page: safe area, background color and padding
export function Screen({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
});
