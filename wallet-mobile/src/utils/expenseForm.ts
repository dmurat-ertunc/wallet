import { Currency, ExpenseCategory, ExpenseRequest, PaymentMethod } from '@/models';

import { toIsoDate } from './format';

// Harcama formuyla ilgili saf fonksiyonlar: boş form, doğrulama ve backend'e gidecek veriye dönüştürme.
// React'ten bağımsız oldukları için ekran olmadan da test edilebilir ve başka yerlerde tekrar kullanılabilirler.

// Kullanıcı yazarken formun tuttuğu değerler; tutar gönderilene kadar metin olarak kalır ("450,50" gibi)
export type ExpenseFormValues = {
  title: string;
  amount: string;
  currency: Currency;
  // null → henüz seçilmedi
  category: ExpenseCategory | null;
  paymentMethod: PaymentMethod | null;
  expenseDate: Date;
  description: string;
};

// Her alan için isteğe bağlı bir hata mesajı, ör. { title: 'Başlık zorunlu' }
// Partial: tüm alanlar isteğe bağlı; Record<keyof ..., string>: anahtarlar formun alan adları
export type ExpenseFormErrors = Partial<Record<keyof ExpenseFormValues, string>>;

// Formun açılıştaki hali: para birimi TRY, tarih bugün, geri kalanı boş
export function createEmptyExpenseForm(): ExpenseFormValues {
  return {
    title: '',
    amount: '',
    currency: Currency.TRY,
    category: null,
    paymentMethod: null,
    expenseDate: new Date(),
    description: '',
  };
}

// Backend'deki ExpenseDTO ile aynı sınırlar (@Size, @Digits(integer = 13, fraction = 2), @DecimalMin("0.01"))
const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;
// En fazla 13 tam basamak, isteğe bağlı olarak nokta ve 1-2 ondalık basamak
const AMOUNT_PATTERN = /^\d{1,13}(\.\d{1,2})?$/;

// Tutar metnini sayıya çevirir; hem "450,50" (Türkçe klavye) hem "450.50" kabul edilir.
// Geçersizse veya 0.01'den küçükse null döner.
export function parseAmount(input: string): number | null {
  // Baştaki/sondaki boşlukları at, virgülü noktaya çevir
  const normalized = input.trim().replace(',', '.');
  if (!AMOUNT_PATTERN.test(normalized)) {
    return null;
  }
  const amount = Number(normalized);
  return amount >= 0.01 ? amount : null;
}

// Formu kontrol eder ve Türkçe hata mesajlarını döndürür; boş nesne dönerse form geçerlidir.
// Kurallar backend'dekilerle aynı olduğu için hatalar istek gitmeden telefonda yakalanır.
export function validateExpenseForm(values: ExpenseFormValues): ExpenseFormErrors {
  const errors: ExpenseFormErrors = {};

  // Başlık: zorunlu, en fazla 100 karakter
  const title = values.title.trim();
  if (!title) {
    errors.title = 'Başlık zorunlu';
  } else if (title.length > TITLE_MAX) {
    errors.title = `Başlık en fazla ${TITLE_MAX} karakter olabilir`;
  }

  // Tutar: zorunlu ve geçerli bir sayı olmalı
  if (!values.amount.trim()) {
    errors.amount = 'Tutar zorunlu';
  } else if (parseAmount(values.amount) === null) {
    errors.amount = 'Geçerli bir tutar girin (ör. 450,50)';
  }

  // Kategori ve ödeme yöntemi: seçilmiş olmalı
  if (!values.category) {
    errors.category = 'Kategori seçin';
  }

  if (!values.paymentMethod) {
    errors.paymentMethod = 'Ödeme yöntemi seçin';
  }

  // Açıklama: isteğe bağlı ama en fazla 500 karakter
  if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Açıklama en fazla ${DESCRIPTION_MAX} karakter olabilir`;
  }

  return errors;
}

// Form verisini backend'in beklediği JSON gövdesine çevirir.
// Sadece validateExpenseForm hata döndürmediyse çağrılmalı.
export function toExpenseRequest(values: ExpenseFormValues, userId: number): ExpenseRequest {
  const description = values.description.trim();
  return {
    title: values.title.trim(),
    // "!" işaretleri: doğrulamadan geçtiği için bu değerlerin boş (null) olamayacağını TypeScript'e söyler
    amount: parseAmount(values.amount)!,
    currency: values.currency,
    category: values.category!,
    paymentMethod: values.paymentMethod!,
    // Date → "2026-10-24"
    expenseDate: toIsoDate(values.expenseDate),
    // Boş açıklama boş metin yerine null olarak gönderilir
    description: description || null,
    userId,
  };
}
