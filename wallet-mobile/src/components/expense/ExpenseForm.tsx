import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { AppButton, AppInput, AppText, ChipSelect, type ChipOption, DateField } from '@/components/common';
import { CategoryLabels, PaymentMethodLabels, Spacing } from '@/constants';
import { type ExpenseFormState } from '@/hooks';
import { Currency, ExpenseCategory, PaymentMethod } from '@/models';

// Seçenek listeleri enum'lardan bir kez üretilir; böylece form her zaman backend'in kabul ettiği değerleri sunar.
// Enum'a yeni bir değer eklenince form da otomatik güncellenir.

// Para birimleri: değer ve etiket aynı (TRY, USD...)
const currencyOptions: ChipOption<Currency>[] = Object.values(Currency).map((value) => ({ value, label: value }));

// Kategoriler: değer İngilizce (FOOD), etiket Türkçe (Yemek)
const categoryOptions: ChipOption<ExpenseCategory>[] = Object.values(ExpenseCategory).map((value) => ({
  value,
  label: CategoryLabels[value],
}));

// Ödeme yöntemleri: değer İngilizce (CASH), etiket Türkçe (Nakit)
const paymentMethodOptions: ChipOption<PaymentMethod>[] = Object.values(PaymentMethod).map((value) => ({
  value,
  label: PaymentMethodLabels[value],
}));

// Elle harcama girme formu.
// Form durumu burada değil useExpenseForm'da (sayfada) tutulur; böylece segment değiştirince yazılanlar kaybolmaz.
export function ExpenseForm({ form }: { form: ExpenseFormState }) {
  // values: alanların değerleri, errors: alan hataları, submitError: genel hata,
  // submitting: gönderim sürüyor mu, setField: bir alanı güncelle, submit: kaydet
  const { values, errors, submitError, submitting, setField, submit } = form;

  return (
    // Klavye açılınca alanların klavyenin altında kalmasını önler (iOS'ta gerekli, Android kendisi hallediyor)
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      {/* keyboardShouldPersistTaps="handled": klavye açıkken bir çipe ilk dokunuşta tıklama çalışsın */}
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppInput
          label="Başlık"
          placeholder="ör. Migros alışverişi"
          value={values.title}
          onChangeText={(text) => setField('title', text)}
          error={errors.title}
          // Backend'deki @Size(max = 100) ile aynı sınır
          maxLength={100}
          returnKeyType="next"
        />

        <AppInput
          label="Tutar"
          placeholder="0,00"
          value={values.amount}
          onChangeText={(text) => setField('amount', text)}
          error={errors.amount}
          // Rakam ve ondalık ayırıcı içeren klavye
          // keyboardType="decimal-pad"
        />

        <ChipSelect
          label="Para birimi"
          options={currencyOptions}
          value={values.currency}
          onChange={(value) => setField('currency', value)}
          error={errors.currency}
        />

        <ChipSelect
          label="Kategori"
          options={categoryOptions}
          value={values.category}
          onChange={(value) => setField('category', value)}
          error={errors.category}
        />

        <ChipSelect
          label="Ödeme yöntemi"
          options={paymentMethodOptions}
          value={values.paymentMethod}
          onChange={(value) => setField('paymentMethod', value)}
          error={errors.paymentMethod}
        />

        <DateField
          label="Tarih"
          value={values.expenseDate}
          onChange={(date) => setField('expenseDate', date)}
          error={errors.expenseDate}
        />

        <AppInput
          label="Açıklama"
          optional
          placeholder="Not ekleyin"
          value={values.description}
          onChangeText={(text) => setField('description', text)}
          error={errors.description}
          // Backend'deki @Size(max = 500) ile aynı sınır
          maxLength={500}
          multiline
        />
      </ScrollView>

      {/* Backend veya bağlantı hatası varsa butonun üstünde gösterilir */}
      {submitError ? (
        <AppText color="danger" style={styles.submitError}>
          {submitError}
        </AppText>
      ) : null}
      {/* Kaydet butonu kaydırılan alanın dışında, ekranın altında sabit durur */}
      <AppButton title="Kaydet" onPress={submit} loading={submitting} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // Alanlar arasında 24 piksel boşluk
  content: { gap: Spacing.lg, paddingBottom: Spacing.lg },
  submitError: { textAlign: 'center', marginBottom: Spacing.sm },
});
