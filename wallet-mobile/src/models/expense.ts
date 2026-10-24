import { Currency, ExpenseCategory, PaymentMethod } from './enums';

// Backend'den gelen bir harcama; com.fin.wallet.dto.ExpenseDTO'nun aynası.
// Tarihler API'den ISO biçiminde metin olarak gelir.
export interface Expense {
  // Veritabanının verdiği benzersiz numara
  id: number;
  title: string;
  // İsteğe bağlı açıklama; boşsa null gelir
  description?: string | null;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  // Harcamanın yapıldığı gün, ör. "2026-10-24"
  expenseDate: string;
  // Harcamanın sahibi olan kullanıcının id'si
  userId: number;
  // Kaydın oluşturulma ve son güncellenme zamanı (sunucu doldurur)
  createdAt: string;
  updatedAt: string;
}

// Harcama eklerken veya güncellerken gönderilen gövde.
// Omit: Expense'ten bu üç alanı çıkarır; id ve zaman bilgilerini sunucu belirlediği için gönderilmezler.
export type ExpenseRequest = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
