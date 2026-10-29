import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { useTheme } from '@/hooks';

type PasswordToggleProps = {
  // Şifre şu an açık mı görünüyor
  visible: boolean;
  // Basılınca çağrılır; sayfa kendi visible state'ini tersine çevirir
  onToggle: () => void;
};

// Şifre alanının sağındaki göz ikonu: şifreyi göster / gizle. AppInput'un trailing özelliğine verilir.
export function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
      // İkon küçük olduğu için dokunma alanı her yönden 12 piksel büyütülür
      hitSlop={12}>
      <SymbolView
        name={
          visible
            ? { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
            : { ios: 'eye', android: 'visibility', web: 'visibility' }
        }
        size={20}
        tintColor={theme.textSecondary}
      />
    </Pressable>
  );
}
