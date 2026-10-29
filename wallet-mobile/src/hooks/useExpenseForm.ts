import { useState } from 'react';

import { Expense } from '@/models';
import { ApiError, expenseService } from '@/services';
import {
  createEmptyExpenseForm,
  type ExpenseFormErrors,
  type ExpenseFormValues,
  toExpenseRequest,
  validateExpenseForm,
} from '@/utils';

// Harcama ekleme formunun tüm durumunu tutar ve formu backend'e gönderir; sayfa sadece bunu ekrana çizer.
// onSaved: kayıt başarılı olunca çağrılacak fonksiyon (ör. modalı kapatmak için router.back()).
export function useExpenseForm(onSaved: (expense: Expense) => void) {
  // Formdaki alanların değerleri; başlangıç değeri createEmptyExpenseForm'dan gelir.
  // Fonksiyonun kendisi verildiği için (çağrılmadan) sadece ilk çizimde çalışır.
  const [values, setValues] = useState<ExpenseFormValues>(createEmptyExpenseForm);
  // Alan bazında hata mesajları, ör. { amount: 'Tutar zorunlu' }
  const [errors, setErrors] = useState<ExpenseFormErrors>({});
  // Formun altında gösterilen genel hata (backend veya bağlantı hatası)
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Gönderim sürüyor mu; true iken Kaydet butonu dönen simge gösterir ve basılamaz
  const [submitting, setSubmitting] = useState(false);

  // Tek bir alanı günceller ve o alanın hatasını siler; kullanıcı düzeltince kırmızı mesaj hemen kaybolur.
  // <K extends keyof ExpenseFormValues>: key'e göre value'nun tipi kontrol edilir (ör. 'amount' için string).
  function setField<K extends keyof ExpenseFormValues>(key: K, value: ExpenseFormValues[K]) {
    // Fonksiyon biçimi (current => ...) her zaman en güncel değer üzerinden çalışmayı garanti eder
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  // Kaydet butonuna basılınca çalışır
  async function submit() {
    // 1. Önce telefonda doğrula; hata varsa backend'e hiç istek gitmez
    const validationErrors = validateExpenseForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // 2. Gönderim başladı: buton kilitlenir, eski genel hata temizlenir
    setSubmitting(true);
    setSubmitError(null);
    try {
      // 3. Form verisini backend biçimine çevir ve gönder; harcamanın sahibini backend token'dan belirler
      const saved = await expenseService.create(toExpenseRequest(values));
      // 4. Başarılı: dışarıdan verilen fonksiyonu çağır
      onSaved(saved);
    } catch (e) {
      if (e instanceof ApiError) {
        // Backend'deki alan adları formdakilerle aynı (bkz. ExpenseDTO), bu yüzden mesajlar doğru inputun altına düşer
        setErrors(e.fieldErrors);
        setSubmitError(e.message);
      } else {
        // Beklenmeyen bir hata
        setSubmitError('Harcama kaydedilemedi');
      }
    } finally {
      // 5. Başarılı da olsa hata da olsa gönderim bitti, buton tekrar basılabilir
      setSubmitting(false);
    }
  }

  return { values, errors, submitError, submitting, setField, submit };
}

// Formun ihtiyaç duyduğu her şeyin tipi; bileşenler hook'un sonucunu tek bir prop olarak alabilsin diye.
// ReturnType<typeof useExpenseForm>: fonksiyonun döndürdüğü nesnenin tipini otomatik çıkarır.
export type ExpenseFormState = ReturnType<typeof useExpenseForm>;
