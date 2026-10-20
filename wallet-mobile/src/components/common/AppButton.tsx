import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';

import { AppText } from './AppText';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function AppButton({ title, onPress, loading = false, disabled = false }: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary, opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1 },
      ]}>
      {loading ? (
        <ActivityIndicator color={theme.onPrimary} />
      ) : (
        <AppText color="onPrimary" style={styles.title}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  title: { fontWeight: '600' },
});
