import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen, SegmentedControl, type SegmentOption } from '@/components/common';
import { ExpenseForm, ReceiptCamera } from '@/components/expense';
import { Spacing } from '@/constants';
import { useExpenseForm } from '@/hooks';

// Harcama ekleme yöntemi: elle form doldurma veya fişin fotoğrafını çekme
type EntryMode = 'manual' | 'photo';

// Üstteki segmentlerin seçenekleri; component dışında tanımlı olduğu için her çizimde yeniden oluşturulmaz
const modeOptions: SegmentOption<EntryMode>[] = [
  { value: 'manual', label: 'Elle ekle' },
  { value: 'photo', label: 'Fotoğraf ile ekle' },
];

// Yeni Harcama ekranı (modal). Üstte segment, altında seçili moda göre form veya kamera gösterilir.
export function ExpenseFormPage() {
  // Hangi segmentin seçili olduğu; ekran "Elle ekle" ile açılır
  const [mode, setMode] = useState<EntryMode>('manual');
  // Fotoğraf kamerada değil burada tutuluyor; böylece segment değiştirince kaybolmuyor
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  // Form durumu da sayfada tutuluyor; segment değişip form ekrandan kalksa bile yazılanlar kaybolmaz.
  // Kayıt başarılı olunca modal kapanır; liste ekranı öne gelince kendini yeniden çeker.
  const form = useExpenseForm(() => router.back());

  return (
    <Screen>
      <View style={styles.container}>
        <SegmentedControl options={modeOptions} value={mode} onChange={setMode} />
        {mode === 'manual' ? (
          <ExpenseForm form={form} />
        ) : (
          <ReceiptCamera photoUri={photoUri} onCapture={setPhotoUri} onRetake={() => setPhotoUri(null)} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // flex: 1 → kalan tüm alanı kapla; gap → segment ile içerik arasında boşluk
  container: { flex: 1, gap: Spacing.md },
});
