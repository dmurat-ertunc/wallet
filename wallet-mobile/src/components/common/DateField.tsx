import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants';
import { useTheme } from '@/hooks';
import { formatDate, toIsoDate } from '@/utils';

import { AppText } from './AppText';
import { FormField } from './FormField';

type DateFieldProps = {
  label: string;
  // Seçili tarih (JavaScript Date nesnesi)
  value: Date;
  // Kullanıcı yeni bir tarih seçince çağrılır
  onChange: (date: Date) => void;
  error?: string;
};

// Etiketli tarih seçici. Platforma göre farklı çalışır.
export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const theme = useTheme();

  // iOS: seçici sayfanın içinde küçük (compact) bir düğme olarak çizilir, dokununca takvim açılır
  if (Platform.OS === 'ios') {
    return (
      <FormField label={label} error={error}>
        <View style={styles.iosRow}>
          <DateTimePicker
            value={value}
            mode="date"
            display="compact"
            locale="tr-TR"
            // onValueChange kütüphanenin yeni API'si; eski onChange artık önerilmiyor
            onValueChange={(_, date) => onChange(date)}
          />
        </View>
      </FormField>
    );
  }

  // Android ve web: tarih bir kutuda yazı olarak gösterilir, dokununca takvim penceresi (dialog) açılır
  const openPicker = () => {
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      onValueChange: (_, date) => onChange(date),
    });
  };

  return (
    <FormField label={label} error={error}>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        style={[
          styles.input,
          { backgroundColor: theme.surface, borderColor: error ? theme.danger : theme.border },
        ]}>
        {/* Date → "2026-10-24" → "24.10.2026" */}
        <AppText style={styles.text}>{formatDate(toIsoDate(value))}</AppText>
      </Pressable>
    </FormField>
  );
}

const styles = StyleSheet.create({
  // iOS seçicisi kendi genişliğinde kalsın, sola yaslansın
  iosRow: { alignItems: 'flex-start' },
  // AppInput ile aynı görünüm, böylece form alanları tutarlı olur
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs,
  },
  text: { fontSize: FontSize.md },
});
