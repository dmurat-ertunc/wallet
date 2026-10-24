import { ExpenseCategory, PaymentMethod } from '@/models';

// Enum değerlerinin arayüzde gösterilen Türkçe karşılıkları.
// Record<Enum, string> tipi sayesinde enum'a yeni bir değer eklenip burada karşılığı yazılmazsa TypeScript hata verir.

// Kategori adları, ör. GROCERIES → "Market"
export const CategoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: 'Yemek',
  [ExpenseCategory.GROCERIES]: 'Market',
  [ExpenseCategory.TRANSPORTATION]: 'Ulaşım',
  [ExpenseCategory.HOUSING]: 'Kira / Konut',
  [ExpenseCategory.UTILITIES]: 'Faturalar',
  [ExpenseCategory.HEALTH]: 'Sağlık',
  [ExpenseCategory.EDUCATION]: 'Eğitim',
  [ExpenseCategory.ENTERTAINMENT]: 'Eğlence',
  [ExpenseCategory.SHOPPING]: 'Alışveriş',
  [ExpenseCategory.CLOTHING]: 'Giyim',
  [ExpenseCategory.TRAVEL]: 'Seyahat',
  [ExpenseCategory.SUBSCRIPTIONS]: 'Abonelikler',
  [ExpenseCategory.PERSONAL_CARE]: 'Kişisel Bakım',
  [ExpenseCategory.GIFTS]: 'Hediyeler',
  [ExpenseCategory.INSURANCE]: 'Sigorta',
  [ExpenseCategory.TAXES]: 'Vergiler',
  [ExpenseCategory.OTHER]: 'Diğer',
};

// Ödeme yöntemi adları, ör. CASH → "Nakit"
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: 'Nakit',
  [PaymentMethod.CREDIT_CARD]: 'Kredi Kartı',
  [PaymentMethod.DEBIT_CARD]: 'Banka Kartı',
  [PaymentMethod.BANK_TRANSFER]: 'Havale / EFT',
  [PaymentMethod.MOBILE_PAYMENT]: 'Mobil Ödeme',
  [PaymentMethod.OTHER]: 'Diğer',
};
